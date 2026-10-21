import type { Turno } from '~/config/site'
import { aMinutos, horaLegible } from './formato'

export interface MomentoClinica {
  /** 0 = domingo. */
  dia: number
  /** Minutos desde la medianoche, hora de la clínica. */
  minutos: number
}

/** Día y hora en la zona horaria de la clínica, sin importar la del visitante. */
export function momentoEnClinica(fecha: Date, zonaHoraria: string): MomentoClinica {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: zonaHoraria,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(fecha)
  const valor = (tipo: string) => partes.find(p => p.type === tipo)?.value ?? ''
  const dias = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return { dia: dias.indexOf(valor('weekday')), minutos: Number(valor('hour')) * 60 + Number(valor('minute')) }
}

export interface EstadoClinica {
  abierto: boolean
  /** "Abierto ahora", "En comida", "Cerrado". */
  titulo: string
  /** "Hoy cerramos a las 7:00 p. m.", "Abrimos mañana a las 9:00 a. m."… */
  detalle: string
}

const NOMBRES_DIA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

function siguienteApertura(horario: (Turno | null)[], dia: number): { dias: number; turno: Turno } | null {
  for (let i = 1; i <= 7; i++) {
    const turno = horario[(dia + i) % 7]
    if (turno) return { dias: i, turno }
  }
  return null
}

export function estadoClinica({ dia, minutos }: MomentoClinica, horario: (Turno | null)[]): EstadoClinica {
  const turno = horario[dia]
  if (turno) {
    const abre = aMinutos(turno.abre)
    const cierra = aMinutos(turno.cierra)
    if (minutos < abre) {
      return { abierto: false, titulo: 'Cerrado', detalle: `Hoy abrimos a las ${horaLegible(turno.abre)}` }
    }
    if (minutos < cierra) {
      const d = turno.descanso
      if (d && minutos >= aMinutos(d.desde) && minutos < aMinutos(d.hasta)) {
        return { abierto: false, titulo: 'En comida', detalle: `Regresamos a las ${horaLegible(d.hasta)}` }
      }
      return { abierto: true, titulo: 'Abierto ahora', detalle: `Hoy cerramos a las ${horaLegible(turno.cierra)}` }
    }
  }
  const sig = siguienteApertura(horario, dia)
  if (!sig) return { abierto: false, titulo: 'Cerrado', detalle: '' }
  const cuando = sig.dias === 1 ? 'mañana' : `el ${NOMBRES_DIA[(dia + sig.dias) % 7]}`
  return { abierto: false, titulo: 'Cerrado', detalle: `Abrimos ${cuando} a las ${horaLegible(sig.turno.abre)}` }
}
