import type { Tratamiento } from '~/data/tratamientos'
import type { Pieza } from '~/data/piezas'

export interface SeleccionPlan {
  slug: string
  /** Piezas FDI (solo para tratamientos por pieza). */
  piezas: number[]
}

export interface LineaPlan {
  slug: string
  codigo: string
  nombre: string
  piezas: number[]
  cantidad: number
  unitario: number
  subtotal: number
  citas: number
  /** Falta elegir piezas en el odontograma. */
  pendiente: boolean
}

export interface Plan {
  lineas: LineaPlan[]
  total: number
  citas: number
  /** Hay tratamientos por pieza sin piezas elegidas. */
  incompleto: boolean
}

/** Piezas válidas para un tratamiento (según el tipo de pieza en que aplica). */
export function piezasValidas(t: Tratamiento, fdis: number[], catalogo: Pieza[]): number[] {
  if (!t.porPieza) return []
  const tipos = t.aplicaA ?? []
  return [...new Set(fdis)]
    .filter(f => {
      const p = catalogo.find(x => x.fdi === f)
      return p && tipos.includes(p.tipo)
    })
    .sort((a, b) => a - b)
}

export function calcularPlan(seleccion: SeleccionPlan[], catalogo: Tratamiento[], piezas: Pieza[]): Plan {
  const lineas: LineaPlan[] = []
  for (const s of seleccion) {
    const t = catalogo.find(x => x.slug === s.slug)
    if (!t) continue
    const elegidas = piezasValidas(t, s.piezas, piezas)
    const cantidad = t.porPieza ? elegidas.length : 1
    const citas = cantidad === 0 ? 0 : Math.ceil(t.citas.base + t.citas.porPieza * (t.porPieza ? cantidad : 0))
    lineas.push({
      slug: t.slug,
      codigo: t.codigo,
      nombre: t.nombre,
      piezas: elegidas,
      cantidad,
      unitario: t.desde,
      subtotal: t.desde * cantidad,
      citas: Math.max(citas, cantidad > 0 ? 1 : 0),
      pendiente: t.porPieza && cantidad === 0,
    })
  }
  return {
    lineas,
    total: lineas.reduce((s, l) => s + l.subtotal, 0),
    citas: lineas.reduce((s, l) => s + l.citas, 0),
    incompleto: lineas.some(l => l.pendiente),
  }
}
