import type { Tono } from '~/data/tonos'

export interface EstimacionBlanqueamiento {
  /** Tonos que se aclararían (posiciones en la escala). */
  pasos: number
  sesiones: number
  precio: number
  /** El objetivo es más oscuro o igual al tono actual. */
  sinCambio: boolean
  /** Meta poco realista (más de 10 posiciones): requiere valoración especial. */
  ambicioso: boolean
  mensaje: string
}

export const indiceTono = (escala: Tono[], codigo: string) => escala.findIndex(t => t.codigo === codigo)

/** Posiciones en la escala que se aclara (positivo = más claro). */
export function diferenciaTonos(escala: Tono[], actual: string, meta: string): number {
  const a = indiceTono(escala, actual)
  const m = indiceTono(escala, meta)
  if (a < 0 || m < 0) throw new Error(`Tono desconocido: ${a < 0 ? actual : meta}`)
  return a - m
}

/**
 * Sesiones orientativas: hasta 3 posiciones, 1 sesión; luego una más cada 3 posiciones, con tope de 4.
 * Los resultados reales dependen de cada persona y requieren valoración.
 */
export function sesionesEstimadas(pasos: number): number {
  if (pasos <= 0) return 0
  return Math.min(Math.ceil(pasos / 3), 4)
}

export function estimarBlanqueamiento(escala: Tono[], actual: string, meta: string, precioSesion: number): EstimacionBlanqueamiento {
  const pasos = diferenciaTonos(escala, actual, meta)
  const sesiones = sesionesEstimadas(pasos)
  const ambicioso = pasos > 10
  let mensaje: string
  if (pasos <= 0) mensaje = 'Ese tono no es más claro que el tuyo: no hace falta blanquear para llegar ahí.'
  else if (ambicioso) mensaje = 'Es un cambio grande. Puede que no se alcance solo con blanqueamiento; lo vemos en la valoración.'
  else if (sesiones === 1) mensaje = 'Un cambio discreto: suele bastar una sesión.'
  else mensaje = `Un cambio de ${pasos} posiciones en la escala: alrededor de ${sesiones} sesiones.`
  return { pasos: Math.max(pasos, 0), sesiones, precio: sesiones * precioSesion, sinCambio: pasos <= 0, ambicioso, mensaje }
}
