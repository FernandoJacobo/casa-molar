/**
 * Las 32 piezas permanentes con numeración FDI (cuadrante + posición).
 * Contenido orientativo por tipo de pieza; no sustituye una valoración.
 */
import type { TipoPieza } from './tratamientos'

export type Arcada = 'superior' | 'inferior'
export type Lado = 'derecho' | 'izquierdo'

export interface Pieza {
  /** Código FDI, p. ej. 11, 26, 48. */
  fdi: number
  cuadrante: 1 | 2 | 3 | 4
  /** 1 = incisivo central … 8 = tercer molar. */
  posicion: number
  tipo: TipoPieza
  arcada: Arcada
  /** Lado del paciente. */
  lado: Lado
  nombre: string
  nombreCorto: string
  funcion: string
  problemas: string[]
  tratamientos: string[]
  dato: string
}

const NOMBRES: Record<number, { nombre: string; corto: string; tipo: TipoPieza }> = {
  1: { nombre: 'Incisivo central', corto: 'Inc. central', tipo: 'incisivo' },
  2: { nombre: 'Incisivo lateral', corto: 'Inc. lateral', tipo: 'incisivo' },
  3: { nombre: 'Canino', corto: 'Canino', tipo: 'canino' },
  4: { nombre: 'Primer premolar', corto: '1.er premolar', tipo: 'premolar' },
  5: { nombre: 'Segundo premolar', corto: '2.º premolar', tipo: 'premolar' },
  6: { nombre: 'Primer molar', corto: '1.er molar', tipo: 'molar' },
  7: { nombre: 'Segundo molar', corto: '2.º molar', tipo: 'molar' },
  8: { nombre: 'Tercer molar (cordal)', corto: 'Cordal', tipo: 'cordal' },
}

const POR_TIPO: Record<TipoPieza, { funcion: string; problemas: string[]; tratamientos: string[] }> = {
  incisivo: {
    funcion: 'Corta los alimentos, como una tijera. También sostiene el labio y ayuda a pronunciar la "f", la "s" y la "t".',
    problemas: [
      'Despostillados por golpes o por morder cosas duras.',
      'Manchas y cambio de tono con los años.',
      'Apiñamiento: suelen ser los primeros en encimarse.',
      'Desgaste del borde si aprietas los dientes.',
    ],
    tratamientos: ['resinas', 'blanqueamiento', 'carillas', 'alineadores'],
  },
  canino: {
    funcion: 'Desgarra y guía la mordida: cuando mueves la mandíbula de lado, el canino separa los demás dientes y los protege.',
    problemas: [
      'Desgaste de la punta si rechinas los dientes.',
      'Encía retraída en la cara de enfrente (cepillado fuerte).',
      'En la arcada superior a veces se queda sin salir (incluido).',
    ],
    tratamientos: ['resinas', 'carillas', 'brackets', 'endodoncia'],
  },
  premolar: {
    funcion: 'Tritura. Es la transición entre los dientes que cortan y los que muelen, y una pieza muy visible al sonreír ancho.',
    problemas: [
      'Caries entre un diente y otro, que no se ve en el espejo.',
      'Fracturas en piezas con resinas grandes.',
      'Sensibilidad al frío en el cuello del diente.',
    ],
    tratamientos: ['resinas', 'endodoncia', 'carillas', 'brackets'],
  },
  molar: {
    funcion: 'Muele. Recibe la mayor parte de la fuerza al masticar y mantiene la altura de la mordida.',
    problemas: [
      'Caries en los surcos de la superficie de masticar.',
      'Fisuras y fracturas por apretar o rechinar.',
      'Infección del nervio cuando una caries avanza sin dolor.',
    ],
    tratamientos: ['resinas', 'endodoncia', 'implantes', 'limpieza'],
  },
  cordal: {
    funcion: 'Es el último molar. Hoy muchas mandíbulas no tienen espacio para él, así que no siempre sale ni hace falta.',
    problemas: [
      'Sale a medias y la encía de encima se inflama.',
      'Empuja o daña al segundo molar.',
      'Es difícil de limpiar: acumula caries.',
    ],
    tratamientos: ['limpieza', 'resinas'],
  },
}

const DATOS: Record<number, string> = {
  1: 'Es la pieza que más se ve al sonreír y la que más se golpea en caídas.',
  2: 'Es el diente que con más frecuencia nace más pequeño o con forma de grano de arroz.',
  3: 'Tiene la raíz más larga de toda la boca: por eso suele ser de las últimas piezas en perderse.',
  4: 'En los superiores suele tener dos raíces; por eso su endodoncia es un poco más larga.',
  5: 'Muchas veces es la pieza que se retira cuando hace falta espacio para la ortodoncia.',
  6: 'Sale hacia los 6 años, sin que se caiga ninguno de leche: por eso a veces se confunde con uno temporal.',
  7: 'Sale hacia los 12 años. Es el más difícil de alcanzar con el cepillo después del cordal.',
  8: 'No siempre hay que sacarlo: si salió completo, está sano y se limpia bien, se puede quedar.',
}

const CUADRANTE: Record<number, { arcada: Arcada; lado: Lado }> = {
  1: { arcada: 'superior', lado: 'derecho' },
  2: { arcada: 'superior', lado: 'izquierdo' },
  3: { arcada: 'inferior', lado: 'izquierdo' },
  4: { arcada: 'inferior', lado: 'derecho' },
}

function crearPieza(cuadrante: 1 | 2 | 3 | 4, posicion: number): Pieza {
  const base = NOMBRES[posicion]!
  const { arcada, lado } = CUADRANTE[cuadrante]!
  const contenido = POR_TIPO[base.tipo]
  const [primera, ...resto] = base.nombre.split(' (')
  const sufijo = resto.length ? ` (${resto.join(' (')}` : ''
  return {
    fdi: cuadrante * 10 + posicion,
    cuadrante,
    posicion,
    tipo: base.tipo,
    arcada,
    lado,
    nombre: `${primera} ${arcada} ${lado}${sufijo}`,
    nombreCorto: base.corto,
    funcion: contenido.funcion,
    problemas: contenido.problemas,
    tratamientos: contenido.tratamientos,
    dato: DATOS[posicion]!,
  }
}

const POSICIONES = [1, 2, 3, 4, 5, 6, 7, 8]

/** Todas las piezas, ordenadas por cuadrante (11–18, 21–28, 31–38, 41–48). */
export const piezas: Pieza[] = ([1, 2, 3, 4] as const).flatMap(c => POSICIONES.map(p => crearPieza(c, p)))

export const piezaPorFdi = (fdi: number) => piezas.find(p => p.fdi === fdi)

/**
 * Orden visual de izquierda a derecha en pantalla, como se ve al paciente de frente:
 * su lado derecho queda a la izquierda de la pantalla. Superior: 18…11, 21…28. Inferior: 48…41, 31…38.
 */
export function ordenVisual(arcada: Arcada): number[] {
  const [der, izq] = arcada === 'superior' ? [1, 2] : [4, 3]
  return [...POSICIONES.map(p => der * 10 + p).reverse(), ...POSICIONES.map(p => izq * 10 + p)]
}
