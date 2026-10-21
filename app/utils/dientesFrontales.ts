/**
 * Piezas en vista frontal (corona + raíces), para la placa radiográfica y las ilustraciones de
 * tratamientos. Coordenadas locales: el cuello del diente (unión corona-raíz) está en y = 0, la
 * corona crece hacia +y y la raíz hacia −y (pieza superior; para la inferior se refleja).
 */
import type { TipoPieza } from '~/data/tratamientos'

export interface DienteFrontal {
  /** Contorno completo (corona + raíz). */
  contorno: string
  /** Límite corona/raíz. */
  cuello: string
  /** Cámara pulpar y conductos. */
  pulpa: string
  /** Solo la corona (para rellenos de esmalte). */
  corona: string
}

const f = (n: number) => Number(n.toFixed(2))

export function dienteFrontal(tipo: TipoPieza, w: number, hc: number, hr: number): DienteFrontal {
  const a = w / 2
  let corona: string
  if (tipo === 'canino') {
    corona = `M${f(-a)},0 C${f(-a * 1.08)},${f(hc * 0.45)} ${f(-a * 0.7)},${f(hc * 0.78)} 0,${f(hc)} C${f(a * 0.7)},${f(hc * 0.78)} ${f(a * 1.08)},${f(hc * 0.45)} ${f(a)},0`
  }
  else if (tipo === 'incisivo') {
    corona = `M${f(-a * 0.92)},0 C${f(-a * 1.04)},${f(hc * 0.5)} ${f(-a * 1.02)},${f(hc * 0.92)} ${f(-a * 0.78)},${f(hc)} L${f(a * 0.78)},${f(hc)} C${f(a * 1.02)},${f(hc * 0.92)} ${f(a * 1.04)},${f(hc * 0.5)} ${f(a * 0.92)},0`
  }
  else if (tipo === 'premolar') {
    corona = `M${f(-a * 0.9)},0 C${f(-a * 1.1)},${f(hc * 0.55)} ${f(-a * 0.8)},${f(hc * 0.98)} ${f(-a * 0.3)},${f(hc)} Q0,${f(hc * 0.9)} ${f(a * 0.3)},${f(hc)} C${f(a * 0.8)},${f(hc * 0.98)} ${f(a * 1.1)},${f(hc * 0.55)} ${f(a * 0.9)},0`
  }
  else {
    // Molar y cordal: corona ancha con cúspides.
    corona = `M${f(-a * 0.88)},0 C${f(-a * 1.08)},${f(hc * 0.4)} ${f(-a * 1.02)},${f(hc * 0.95)} ${f(-a * 0.62)},${f(hc)} Q${f(-a * 0.32)},${f(hc * 0.86)} 0,${f(hc * 0.98)} Q${f(a * 0.32)},${f(hc * 0.86)} ${f(a * 0.62)},${f(hc)} C${f(a * 1.02)},${f(hc * 0.95)} ${f(a * 1.08)},${f(hc * 0.4)} ${f(a * 0.88)},0`
  }

  let raiz: string
  let pulpa: string
  const cam = Math.min(hc * 0.45, w * 0.5)
  if (tipo === 'molar' || tipo === 'cordal') {
    const r = hr * (tipo === 'cordal' ? 0.8 : 1)
    raiz = `C${f(a * 0.95)},${f(-r * 0.5)} ${f(a * 0.7)},${f(-r)} ${f(a * 0.45)},${f(-r)} C${f(a * 0.25)},${f(-r)} ${f(a * 0.2)},${f(-r * 0.45)} 0,${f(-r * 0.32)} C${f(-a * 0.2)},${f(-r * 0.45)} ${f(-a * 0.25)},${f(-r)} ${f(-a * 0.45)},${f(-r)} C${f(-a * 0.7)},${f(-r)} ${f(-a * 0.95)},${f(-r * 0.5)} ${f(-a * 0.88)},0`
    pulpa = `M${f(-a * 0.45)},${f(cam)} Q0,${f(cam * 1.25)} ${f(a * 0.45)},${f(cam)} L${f(a * 0.42)},${f(-r * 0.15)} L${f(a * 0.45)},${f(-r * 0.92)} M${f(-a * 0.45)},${f(cam)} L${f(-a * 0.42)},${f(-r * 0.15)} L${f(-a * 0.45)},${f(-r * 0.92)}`
  }
  else {
    const r = hr * (tipo === 'canino' ? 1.2 : 1)
    raiz = `C${f(a * 0.85)},${f(-r * 0.55)} ${f(a * 0.3)},${f(-r)} 0,${f(-r)} C${f(-a * 0.3)},${f(-r)} ${f(-a * 0.85)},${f(-r * 0.55)} ${f(tipo === 'incisivo' ? -a * 0.92 : -a * 0.9)},0`
    pulpa = `M${f(-a * 0.25)},${f(cam)} Q0,${f(cam * 1.2)} ${f(a * 0.25)},${f(cam)} L0,${f(-r * 0.92)} Z`
  }

  return {
    contorno: `${corona} ${raiz} Z`,
    cuello: `M${f(-a * 0.92)},0 Q0,${f(-hc * 0.08)} ${f(a * 0.92)},0`,
    pulpa,
    corona: `${corona} Q0,${f(-hc * 0.08)} ${f(-a * 0.9)},0 Z`,
  }
}
