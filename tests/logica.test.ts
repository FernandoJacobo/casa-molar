import { describe, expect, it } from 'vitest'
import { site } from '~/config/site'
import { equipo } from '~/data/equipo'
import { piezas, piezaPorFdi, ordenVisual } from '~/data/piezas'
import { tonos } from '~/data/tonos'
import { tratamientos, tratamientoPorSlug } from '~/data/tratamientos'
import { citasSimuladas, hash, horariosDisponibles, proximosDias } from '~/utils/agenda'
import { geometriaArcada } from '~/utils/arcada'
import { calcularFinanciamiento } from '~/utils/financiamiento'
import { aHHMM, aMinutos, horaLegible, pesos } from '~/utils/formato'
import { estadoClinica, momentoEnClinica } from '~/utils/horario'
import { aUtc, crearIcs, doblarLinea, escaparIcs } from '~/utils/ics'
import { calcularPlan, piezasValidas } from '~/utils/plan'
import { diferenciaTonos, estimarBlanqueamiento, sesionesEstimadas } from '~/utils/tonos'
import { armarMensaje, enlaceWhatsapp, esModoDemo } from '~/utils/whatsapp'

describe('piezas (FDI)', () => {
  it('hay 32 piezas con códigos FDI únicos', () => {
    expect(piezas).toHaveLength(32)
    expect(new Set(piezas.map(p => p.fdi)).size).toBe(32)
  })

  it('nombra la pieza con arcada y lado', () => {
    expect(piezaPorFdi(11)?.nombre).toBe('Incisivo central superior derecho')
    expect(piezaPorFdi(36)?.nombre).toBe('Primer molar inferior izquierdo')
    expect(piezaPorFdi(48)?.nombre).toBe('Tercer molar inferior derecho (cordal)')
  })

  it('el orden visual va del lado derecho del paciente al izquierdo', () => {
    expect(ordenVisual('superior').slice(0, 3)).toEqual([18, 17, 16])
    expect(ordenVisual('superior').slice(7, 9)).toEqual([11, 21])
    expect(ordenVisual('inferior').slice(7, 9)).toEqual([41, 31])
  })

  it('los tratamientos relacionados existen', () => {
    for (const p of piezas) for (const slug of p.tratamientos) expect(tratamientoPorSlug(slug), slug).toBeDefined()
  })

  it('la geometría coloca las 16 piezas de cada arcada, simétricas', () => {
    const g = geometriaArcada('superior')
    expect(g.piezas).toHaveLength(16)
    const p11 = g.piezas.find(p => p.fdi === 11)!
    const p21 = g.piezas.find(p => p.fdi === 21)!
    expect(p11.x).toBeCloseTo(-p21.x)
    expect(p11.angulo).toBeCloseTo(-p21.angulo)
    // Los incisivos al frente (y chica), los cordales al fondo.
    expect(g.piezas.find(p => p.fdi === 18)!.y).toBeGreaterThan(p11.y + 30)
  })
})

describe('horario de la clínica', () => {
  const h = site.horario

  it('abierto en martes a mediodía', () => {
    const e = estadoClinica({ dia: 2, minutos: aMinutos('12:00') }, h)
    expect(e.abierto).toBe(true)
    expect(e.detalle).toBe('Hoy cerramos a las 7:00 p. m.')
  })

  it('en comida a las 14:30', () => {
    const e = estadoClinica({ dia: 3, minutos: aMinutos('14:30') }, h)
    expect(e.abierto).toBe(false)
    expect(e.titulo).toBe('En comida')
  })

  it('sábado en la tarde: abre el lunes', () => {
    const e = estadoClinica({ dia: 6, minutos: aMinutos('15:00') }, h)
    expect(e.abierto).toBe(false)
    expect(e.detalle).toBe('Abrimos el lunes a las 9:00 a. m.')
  })

  it('domingo: abre mañana', () => {
    expect(estadoClinica({ dia: 0, minutos: 600 }, h).detalle).toBe('Abrimos mañana a las 9:00 a. m.')
  })

  it('convierte la hora a la zona de la clínica', () => {
    // 2026-10-21 18:30 UTC = 12:30 en Ciudad de México (miércoles).
    const m = momentoEnClinica(new Date(Date.UTC(2026, 9, 21, 18, 30)), 'America/Mexico_City')
    expect(m).toEqual({ dia: 3, minutos: 12 * 60 + 30 })
  })
})

describe('agenda', () => {
  it('21 días con los domingos cerrados', () => {
    const dias = proximosDias(new Date(2026, 9, 21), site.horario)
    expect(dias).toHaveLength(21)
    expect(dias[0]!.iso).toBe('2026-10-21')
    expect(dias.filter(d => d.cerrado).every(d => d.dia === 0)).toBe(true)
    expect(dias.filter(d => d.cerrado)).toHaveLength(3)
  })

  it('las citas simuladas son deterministas', () => {
    const t = site.horario[1]!
    expect(citasSimuladas('2026-10-26', 'ifigenia', t)).toEqual(citasSimuladas('2026-10-26', 'ifigenia', t))
    expect(hash('a')).not.toBe(hash('b'))
  })

  it('no ofrece horarios en domingo', () => {
    expect(horariosDisponibles({ iso: '2026-10-25', horario: site.horario, equipo, duracion: 45 })).toEqual([])
  })

  it('respeta descanso, cierre, duración y citas ocupadas', () => {
    const iso = '2026-10-26' // lunes
    const duracion = 90
    const r = horariosDisponibles({ iso, horario: site.horario, equipo, duracion })
    expect(r.length).toBeGreaterThan(0)
    for (const { hora, profesionales } of r) {
      const ini = aMinutos(hora)
      const fin = ini + duracion
      expect(ini).toBeGreaterThanOrEqual(aMinutos('09:00'))
      expect(fin).toBeLessThanOrEqual(aMinutos('19:00'))
      expect(ini < aMinutos('15:00') && fin > aMinutos('14:00')).toBe(false)
      for (const id of profesionales) {
        const ocupadas = citasSimuladas(iso, id, site.horario[1]!)
        expect(ocupadas.some(([a, b]) => ini < b && a < fin)).toBe(false)
      }
    }
  })

  it('filtra por profesional y por tratamiento', () => {
    const iso = '2026-10-27' // martes: el Dr. Eleuterio sí da consulta
    const ortodoncia = horariosDisponibles({ iso, horario: site.horario, equipo, duracion: 60, tratamiento: 'brackets' })
    expect(ortodoncia.every(h => h.profesionales.every(p => p === 'eleuterio'))).toBe(true)
    const soloMaite = horariosDisponibles({ iso: '2026-10-28', horario: site.horario, equipo, duracion: 30, profesional: 'maite' })
    expect(soloMaite.every(h => h.profesionales.length === 1 && h.profesionales[0] === 'maite')).toBe(true)
    // El Dr. Eleuterio no da consulta en lunes.
    expect(horariosDisponibles({ iso: '2026-10-26', horario: site.horario, equipo, duracion: 30, profesional: 'eleuterio' })).toEqual([])
  })

  it('hoy no ofrece horas pasadas ni sin anticipación', () => {
    const r = horariosDisponibles({ iso: '2026-10-26', horario: site.horario, equipo, duracion: 30, ahoraMinutos: aMinutos('16:10'), anticipacion: 60 })
    expect(r.every(h => aMinutos(h.hora) >= aMinutos('17:10'))).toBe(true)
  })
})

describe('financiamiento', () => {
  it('sin intereses divide en partes iguales', () => {
    const r = calcularFinanciamiento({ monto: 18000, enganche: 0, plazo: 6, tasaAnual: 0 })
    expect(r.mensualidad).toBe(3000)
    expect(r.intereses).toBe(0)
    expect(r.total).toBe(18000)
  })

  it('el enganche reduce lo financiado', () => {
    const r = calcularFinanciamiento({ monto: 38000, enganche: 8000, plazo: 12, tasaAnual: 0 })
    expect(r.financiado).toBe(30000)
    expect(r.mensualidad).toBe(2500)
    expect(r.total).toBe(38000)
  })

  it('con tasa usa amortización francesa', () => {
    const r = calcularFinanciamiento({ monto: 12000, enganche: 0, plazo: 12, tasaAnual: 0.18 })
    // 12000 · 0.015 / (1 − 1.015^−12) = 1100.16
    expect(r.mensualidad).toBeCloseTo(1100.16, 2)
    expect(r.intereses).toBeCloseTo(1201.92, 1)
  })

  it('enganche mayor al monto: no hay nada que financiar', () => {
    const r = calcularFinanciamiento({ monto: 5000, enganche: 9000, plazo: 3, tasaAnual: 0 })
    expect(r).toEqual({ financiado: 0, mensualidad: 0, intereses: 0, total: 5000 })
  })
})

describe('plan de tratamiento', () => {
  it('multiplica por pieza y suma citas', () => {
    const plan = calcularPlan(
      [{ slug: 'limpieza', piezas: [] }, { slug: 'resinas', piezas: [16, 26, 36] }],
      tratamientos,
      piezas,
    )
    expect(plan.lineas[1]!.subtotal).toBe(900 * 3)
    expect(plan.total).toBe(650 + 2700)
    // limpieza 1 cita + resinas ceil(0.5 · 3) = 2
    expect(plan.citas).toBe(3)
    expect(plan.incompleto).toBe(false)
  })

  it('marca como pendiente un tratamiento por pieza sin piezas', () => {
    const plan = calcularPlan([{ slug: 'endodoncia', piezas: [] }], tratamientos, piezas)
    expect(plan.incompleto).toBe(true)
    expect(plan.total).toBe(0)
  })

  it('ignora piezas donde no aplica el tratamiento', () => {
    const carillas = tratamientoPorSlug('carillas')!
    expect(piezasValidas(carillas, [11, 21, 16, 21], piezas)).toEqual([11, 21])
    const implantes = tratamientoPorSlug('implantes')!
    expect(piezasValidas(implantes, [18, 46], piezas)).toEqual([46])
  })
})

describe('simulador de tonos', () => {
  it('la diferencia es positiva al aclarar', () => {
    expect(diferenciaTonos(tonos, 'A3', 'A1')).toBe(7)
    expect(diferenciaTonos(tonos, 'A1', 'A3')).toBe(-7)
  })

  it('sesiones: 1 hasta 3 posiciones y tope de 4', () => {
    expect(sesionesEstimadas(0)).toBe(0)
    expect(sesionesEstimadas(1)).toBe(1)
    expect(sesionesEstimadas(3)).toBe(1)
    expect(sesionesEstimadas(4)).toBe(2)
    expect(sesionesEstimadas(15)).toBe(4)
  })

  it('estima precio y avisa cuando la meta no aclara', () => {
    const e = estimarBlanqueamiento(tonos, 'A3.5', 'A2', 2200)
    expect(e.pasos).toBe(7)
    expect(e.sesiones).toBe(3)
    expect(e.precio).toBe(6600)
    const igual = estimarBlanqueamiento(tonos, 'A2', 'A3', 2200)
    expect(igual.sinCambio).toBe(true)
    expect(igual.precio).toBe(0)
    expect(estimarBlanqueamiento(tonos, 'C4', 'B1', 2200).ambicioso).toBe(true)
  })

  it('rechaza tonos desconocidos', () => {
    expect(() => diferenciaTonos(tonos, 'Z9', 'A1')).toThrow()
  })
})

describe('archivo .ics', () => {
  const ics = crearIcs({
    uid: 'CM-ABC123@casa-molar.demo',
    fecha: '2026-10-27',
    hora: '17:30',
    duracionMin: 45,
    titulo: 'Cita en Casa Molar: Limpieza; revisión',
    descripcion: 'Folio CM-ABC123\nCon la Dra. Ifigenia, puntual',
    lugar: 'Av. Ejemplo 123, Col. Demo, Zapopan',
    utcOffsetHoras: -6,
    creado: new Date(Date.UTC(2026, 9, 21, 12, 0, 0)),
  })

  it('tiene la estructura VCALENDAR/VEVENT con CRLF', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics.split('\r\n').every(l => new TextEncoder().encode(l).length <= 75)).toBe(true)
  })

  it('convierte la hora local a UTC', () => {
    expect(ics).toContain('DTSTART:20261027T233000Z')
    expect(ics).toContain('DTEND:20261028T001500Z')
    expect(ics).toContain('DTSTAMP:20261021T120000Z')
    expect(aUtc('2026-10-27', '09:00', -6).toISOString()).toBe('2026-10-27T15:00:00.000Z')
  })

  it('escapa y dobla según RFC 5545', () => {
    expect(escaparIcs('a,b;c\nd\\e')).toBe('a\\,b\\;c\\nd\\\\e')
    expect(ics).toContain('SUMMARY:Cita en Casa Molar: Limpieza\\; revisión')
    const larga = doblarLinea(`DESCRIPTION:${'ñ'.repeat(60)}`)
    expect(larga).toContain('\r\n ')
    expect(larga.replace(/\r\n /g, '')).toBe(`DESCRIPTION:${'ñ'.repeat(60)}`)
  })
})

describe('WhatsApp', () => {
  it('detecta el modo demo', () => {
    expect(esModoDemo('520000000000', site.whatsappPlaceholder)).toBe(true)
    expect(esModoDemo('', site.whatsappPlaceholder)).toBe(true)
    expect(esModoDemo(undefined, site.whatsappPlaceholder)).toBe(true)
    expect(esModoDemo('0000000000', site.whatsappPlaceholder)).toBe(true)
    expect(esModoDemo('12345', site.whatsappPlaceholder)).toBe(true)
    expect(esModoDemo('523312345678', site.whatsappPlaceholder)).toBe(false)
    expect(esModoDemo('+52 33 1234 5678', site.whatsappPlaceholder)).toBe(false)
  })

  it('arma el mensaje con título y omite campos vacíos', () => {
    const m = armarMensaje('Quiero agendar', [['Nombre', 'Ana'], ['Correo', ''], ['Pieza', 16], ['Notas', undefined]], 'Gracias')
    expect(m).toBe('*Quiero agendar*\n\n• Nombre: Ana\n• Pieza: 16\n\nGracias')
  })

  it('codifica el enlace de wa.me', () => {
    expect(enlaceWhatsapp('+52 33 1234 5678', 'Hola & adiós')).toBe('https://wa.me/523312345678?text=Hola%20%26%20adi%C3%B3s')
  })
})

describe('formato', () => {
  it('horas y pesos', () => {
    expect(horaLegible('19:00')).toBe('7:00 p. m.')
    expect(horaLegible('12:30')).toBe('12:30 p. m.')
    expect(horaLegible('09:05')).toBe('9:05 a. m.')
    expect(aHHMM(aMinutos('17:30'))).toBe('17:30')
    expect(pesos(38000).replace(/\s/g, '')).toBe('$38,000')
  })
})
