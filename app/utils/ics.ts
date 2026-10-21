import { aMinutos } from './formato'

export interface EventoIcs {
  uid: string
  /** "YYYY-MM-DD" en hora local de la clínica. */
  fecha: string
  /** "HH:mm" en hora local de la clínica. */
  hora: string
  duracionMin: number
  titulo: string
  descripcion: string
  lugar: string
  /** Diferencia de la clínica con UTC en horas (p. ej. −6). */
  utcOffsetHoras: number
  /** Momento de creación (DTSTAMP). */
  creado: Date
}

const dos = (n: number) => String(n).padStart(2, '0')

/** Fecha en UTC con formato iCalendar: 20261021T150000Z. */
export function fechaIcsUtc(d: Date): string {
  return `${d.getUTCFullYear()}${dos(d.getUTCMonth() + 1)}${dos(d.getUTCDate())}T${dos(d.getUTCHours())}${dos(d.getUTCMinutes())}${dos(d.getUTCSeconds())}Z`
}

/** Hora local de la clínica → instante UTC. */
export function aUtc(fecha: string, hora: string, utcOffsetHoras: number): Date {
  const [y, m, d] = fecha.split('-').map(Number)
  const minutos = aMinutos(hora) - utcOffsetHoras * 60
  return new Date(Date.UTC(y!, m! - 1, d!, 0, minutos))
}

/** Escapa texto según RFC 5545 (\\, ;, , y saltos de línea). */
export function escaparIcs(texto: string): string {
  return texto.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')
}

/** Dobla líneas de más de 75 octetos (RFC 5545 §3.1), sin partir caracteres multibyte. */
export function doblarLinea(linea: string): string {
  const enc = new TextEncoder()
  const partes: string[] = []
  let actual = ''
  let bytes = 0
  for (const ch of linea) {
    const b = enc.encode(ch).length
    const limite = partes.length === 0 ? 75 : 74
    if (bytes + b > limite) {
      partes.push(actual)
      actual = ''
      bytes = 0
    }
    actual += ch
    bytes += b
  }
  partes.push(actual)
  return partes.join('\r\n ')
}

export function crearIcs(e: EventoIcs): string {
  const inicio = aUtc(e.fecha, e.hora, e.utcOffsetHoras)
  const fin = new Date(inicio.getTime() + e.duracionMin * 60_000)
  const lineas = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Casa Molar (demo)//Agenda//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e.uid}`,
    `DTSTAMP:${fechaIcsUtc(e.creado)}`,
    `DTSTART:${fechaIcsUtc(inicio)}`,
    `DTEND:${fechaIcsUtc(fin)}`,
    `SUMMARY:${escaparIcs(e.titulo)}`,
    `DESCRIPTION:${escaparIcs(e.descripcion)}`,
    `LOCATION:${escaparIcs(e.lugar)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio de tu cita',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return `${lineas.map(doblarLinea).join('\r\n')}\r\n`
}
