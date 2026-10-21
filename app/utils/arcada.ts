/**
 * Geometría de la arcada dentaria en vista oclusal (desde arriba), en milímetros aproximados.
 *
 * La arcada es una parábola y = r·X·(x/X)² recorrida por longitud de arco: cada pieza se coloca a
 * la distancia que le toca según su ancho mesiodistal, y se gira para que su cara exterior mire hacia
 * afuera de la curva.
 */
import type { TipoPieza } from '~/data/tratamientos'
import type { Arcada } from '~/data/piezas'
import { ordenVisual } from '~/data/piezas'

/** Ancho (mesiodistal) y fondo (vestíbulo-lingual) por posición 1–8, en mm. */
const MEDIDAS: Record<Arcada, { ancho: number; fondo: number }[]> = {
  superior: [
    { ancho: 8.6, fondo: 7.0 }, { ancho: 6.6, fondo: 6.2 }, { ancho: 7.6, fondo: 8.0 }, { ancho: 7.0, fondo: 9.0 },
    { ancho: 6.6, fondo: 9.0 }, { ancho: 10.2, fondo: 11.0 }, { ancho: 9.2, fondo: 11.0 }, { ancho: 8.6, fondo: 10.0 },
  ],
  inferior: [
    { ancho: 5.3, fondo: 5.8 }, { ancho: 5.8, fondo: 6.2 }, { ancho: 6.8, fondo: 7.6 }, { ancho: 7.0, fondo: 7.8 },
    { ancho: 7.1, fondo: 8.2 }, { ancho: 11.0, fondo: 10.4 }, { ancho: 10.5, fondo: 10.0 }, { ancho: 10.0, fondo: 9.6 },
  ],
}

/** Tamaño de referencia de cada símbolo base (debe coincidir con `DientesSprite.vue`). */
export const BASE: Record<TipoPieza, { ancho: number; fondo: number }> = {
  incisivo: { ancho: 8, fondo: 7 },
  canino: { ancho: 8, fondo: 8 },
  premolar: { ancho: 7, fondo: 9 },
  molar: { ancho: 10, fondo: 11 },
  cordal: { ancho: 9, fondo: 10 },
}

const TIPO_POR_POSICION: TipoPieza[] = ['incisivo', 'incisivo', 'canino', 'premolar', 'premolar', 'molar', 'molar', 'cordal']

export interface PiezaColocada {
  fdi: number
  tipo: TipoPieza
  /** Centro en mm (origen: línea media al frente de la arcada; y crece hacia el fondo de la boca). */
  x: number
  y: number
  /** Giro en grados para que la cara exterior (−y local) mire hacia afuera. */
  angulo: number
  escalaX: number
  escalaY: number
  /** Normal exterior (unitaria) en coordenadas de la arcada. */
  nx: number
  ny: number
}

export interface Geometria {
  piezas: PiezaColocada[]
  /** Semiancho X de la parábola (mm). */
  semiancho: number
  profundidad: number
  /** Punto de la curva para un x dado. */
  curva: (x: number) => number
}

const SEPARACION = 0.25

function longitudArco(semiancho: number, r: number, hasta = semiancho, pasos = 400): number {
  let l = 0
  let px = 0
  let py = 0
  for (let i = 1; i <= pasos; i++) {
    const x = (hasta * i) / pasos
    const y = r * semiancho * (x / semiancho) ** 2
    l += Math.hypot(x - px, y - py)
    px = x
    py = y
  }
  return l
}

/** x en el que la longitud de arco desde 0 vale `s` (búsqueda binaria). */
function xParaLongitud(s: number, semiancho: number, r: number): number {
  let lo = 0
  let hi = semiancho * 1.6
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (longitudArco(semiancho, r, mid, 200) < s) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

/**
 * @param arcada superior o inferior
 * @param r relación profundidad / semiancho de la parábola (más alto = arcada más en U).
 */
export function geometriaArcada(arcada: Arcada, r = arcada === 'superior' ? 1.75 : 1.6): Geometria {
  const medidas = MEDIDAS[arcada]
  const mitad = medidas.reduce((s, m) => s + m.ancho, 0) + SEPARACION * 7.5

  // Semiancho tal que la longitud de la media arcada sea la suma de las piezas.
  let lo = 5
  let hi = 60
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (longitudArco(mid, r) < mitad) lo = mid
    else hi = mid
  }
  const semiancho = (lo + hi) / 2
  const curva = (x: number) => r * semiancho * (x / semiancho) ** 2

  const colocadas = new Map<number, PiezaColocada>()
  let s = SEPARACION / 2
  medidas.forEach((m, i) => {
    const centro = s + m.ancho / 2
    s += m.ancho + SEPARACION
    const x = xParaLongitud(centro, semiancho, r)
    const y = curva(x)
    const pendiente = (2 * r * x) / semiancho
    const norma = Math.hypot(pendiente, 1)
    const tipo = TIPO_POR_POSICION[i]!
    const base = BASE[tipo]
    for (const lado of [-1, 1] as const) {
      // lado −1 = lado derecho del paciente (izquierda en pantalla).
      const nx = (lado * pendiente) / norma
      const ny = -1 / norma
      const cuadrante = arcada === 'superior' ? (lado === -1 ? 1 : 2) : (lado === -1 ? 4 : 3)
      const fdi = cuadrante * 10 + i + 1
      colocadas.set(fdi, {
        fdi,
        tipo,
        x: lado * x,
        y,
        angulo: (Math.atan2(nx, -ny) * 180) / Math.PI,
        escalaX: m.ancho / base.ancho,
        escalaY: m.fondo / base.fondo,
        nx,
        ny,
      })
    }
  })

  return {
    piezas: ordenVisual(arcada).map(f => colocadas.get(f)!),
    semiancho,
    profundidad: curva(semiancho),
    curva,
  }
}

/** Trazo de la curva de la arcada (línea de encía) desplazado `offset` mm hacia afuera. */
export function trazoCurva(g: Geometria, offset = 0, extension = 1, pasos = 48): string {
  const r = g.profundidad / g.semiancho
  const puntos: string[] = []
  for (let i = 0; i <= pasos; i++) {
    const x = -g.semiancho * extension + (2 * g.semiancho * extension * i) / pasos
    const y = g.curva(x)
    const pendiente = (2 * r * x) / g.semiancho
    const norma = Math.hypot(pendiente, 1)
    const nx = pendiente / norma
    const ny = -1 / norma
    puntos.push(`${(x + nx * offset).toFixed(2)},${(y + ny * offset).toFixed(2)}`)
  }
  return `M${puntos.join(' L')}`
}

/** Cuadrantes en el orden en que se cepillan en el cronómetro. */
export const CUADRANTES_CEPILLADO = [1, 2, 3, 4] as const

export interface Disposicion {
  sup: Geometria
  inf: Geometria
  /** Desplazamiento vertical del frente de cada arcada en el lienzo. */
  origenSup: number
  origenInf: number
  /** Medio ancho del lienzo (el centro está en x = 0). */
  semiancho: number
  altoSup: number
  alto: number
}

/**
 * Las dos arcadas enfrentadas como en un odontograma: la superior con el frente arriba (∩) y la
 * inferior con el frente abajo (∪); los molares de ambas quedan hacia el centro.
 */
export function disposicionArcadas(margen = 7, separacion = 9): Disposicion {
  const sup = geometriaArcada('superior')
  const inf = geometriaArcada('inferior')
  const fondo = (g: Geometria) => Math.max(...g.piezas.map(p => p.y)) + 6
  const altoSup = fondo(sup)
  const origenSup = margen + 4
  const origenInf = origenSup + altoSup + separacion + fondo(inf)
  return {
    sup,
    inf,
    origenSup,
    origenInf,
    semiancho: Math.max(sup.semiancho, inf.semiancho) + 8 + margen,
    altoSup: origenSup + altoSup + margen,
    alto: origenInf + margen,
  }
}

/** Transformación SVG de una pieza dentro de su grupo de arcada. */
export const transformarPieza = (p: PiezaColocada) =>
  `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${p.angulo.toFixed(2)}) scale(${p.escalaX.toFixed(3)} ${p.escalaY.toFixed(3)})`

/** Posición del número FDI en el lienzo: hacia afuera de la pieza, siguiendo la normal. */
export function posicionEtiqueta(d: Disposicion, p: PiezaColocada, inferior: boolean, distancia = 9.5) {
  const x = p.x + p.nx * distancia
  const y = p.y + p.ny * distancia
  return inferior ? { x, y: d.origenInf - y } : { x, y: d.origenSup + y }
}
