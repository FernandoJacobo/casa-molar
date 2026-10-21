import type { Turno } from '~/config/site'
import type { Profesional } from '~/data/equipo'
import { aHHMM, aMinutos, desdeISO, fechaISO } from './formato'

/** Cada cuántos minutos empieza un horario posible. */
export const PASO_MIN = 30

export interface DiaAgenda {
  iso: string
  fecha: Date
  /** 0 = domingo. */
  dia: number
  cerrado: boolean
}

/** Los próximos `n` días a partir de `hoy` (incluido). */
export function proximosDias(hoy: Date, horario: (Turno | null)[], n = 21): DiaAgenda[] {
  const base = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
  return Array.from({ length: n }, (_, i) => {
    const fecha = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)
    return { iso: fechaISO(fecha), fecha, dia: fecha.getDay(), cerrado: !horario[fecha.getDay()] }
  })
}

/** Hash FNV-1a de 32 bits: mismo texto → mismo número, en cualquier navegador. */
export function hash(texto: string): number {
  let h = 0x811C9DC5
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export type Intervalo = [inicio: number, fin: number]

/**
 * Citas "ya agendadas" de un profesional en una fecha. Son simuladas pero deterministas
 * (dependen solo de la fecha y del profesional), así la agenda se ve ocupada de forma creíble
 * y no cambia al recargar.
 */
export function citasSimuladas(iso: string, profesionalId: string, turno: Turno): Intervalo[] {
  const abre = aMinutos(turno.abre)
  const cierra = aMinutos(turno.cierra)
  const ocupadas: Intervalo[] = []
  for (let inicio = abre; inicio < cierra; inicio += PASO_MIN) {
    // ~40 % de los bloques ocupados; algunos de 60 min.
    const h = hash(`${iso}|${profesionalId}|${inicio}`)
    if (h % 100 < 40) {
      const largo = h % 7 === 0 ? 60 : 30
      ocupadas.push([inicio, Math.min(inicio + largo, cierra)])
    }
  }
  return ocupadas
}

const choca = (a: Intervalo, b: Intervalo) => a[0] < b[1] && b[0] < a[1]

export interface HorarioDisponible {
  /** "HH:mm" */
  hora: string
  /** Profesionales que pueden atender en ese horario. */
  profesionales: string[]
}

export interface ConsultaHorarios {
  iso: string
  horario: (Turno | null)[]
  equipo: Profesional[]
  /** Duración de la cita en minutos. */
  duracion: number
  /** Tratamiento (slug) para filtrar profesionales; vacío = cualquiera que dé consulta general. */
  tratamiento?: string
  /** Id de profesional o `null` para "cualquiera". */
  profesional?: string | null
  /** Si la fecha es hoy: minutos actuales en la clínica, para no ofrecer horas pasadas. */
  ahoraMinutos?: number
  /** Anticipación mínima en minutos cuando la fecha es hoy. */
  anticipacion?: number
}

/**
 * Horarios disponibles = horario de la clínica − descanso − citas simuladas − duración del tratamiento.
 */
export function horariosDisponibles(c: ConsultaHorarios): HorarioDisponible[] {
  const dia = desdeISO(c.iso).getDay()
  const turno = c.horario[dia]
  if (!turno) return []

  const abre = aMinutos(turno.abre)
  const cierra = aMinutos(turno.cierra)
  const descanso: Intervalo | null = turno.descanso ? [aMinutos(turno.descanso.desde), aMinutos(turno.descanso.hasta)] : null
  const minimo = c.ahoraMinutos !== undefined ? c.ahoraMinutos + (c.anticipacion ?? 60) : -1

  const candidatos = c.equipo.filter(p =>
    p.dias.includes(dia)
    && (!c.profesional || p.id === c.profesional)
    && (!c.tratamiento || p.tratamientos.includes(c.tratamiento)),
  )
  const ocupacion = new Map(candidatos.map(p => [p.id, citasSimuladas(c.iso, p.id, turno)]))

  const resultado: HorarioDisponible[] = []
  for (let inicio = abre; inicio + c.duracion <= cierra; inicio += PASO_MIN) {
    if (inicio < minimo) continue
    const bloque: Intervalo = [inicio, inicio + c.duracion]
    if (descanso && choca(bloque, descanso)) continue
    const libres = candidatos.filter(p => !(ocupacion.get(p.id) ?? []).some(o => choca(bloque, o))).map(p => p.id)
    if (libres.length) resultado.push({ hora: aHHMM(inicio), profesionales: libres })
  }
  return resultado
}
