export interface Financiamiento {
  monto: number
  enganche: number
  /** Meses. */
  plazo: number
  /** Tasa anual (0 = sin intereses). */
  tasaAnual: number
}

export interface ResultadoFinanciamiento {
  financiado: number
  mensualidad: number
  intereses: number
  /** Enganche + todas las mensualidades. */
  total: number
}

const centavos = (n: number) => Math.round(n * 100) / 100

/**
 * Mensualidad fija. Sin intereses: financiado / plazo.
 * Con intereses: amortización francesa con tasa mensual = anual / 12.
 */
export function calcularFinanciamiento({ monto, enganche, plazo, tasaAnual }: Financiamiento): ResultadoFinanciamiento {
  const engancheReal = Math.min(Math.max(enganche, 0), Math.max(monto, 0))
  const financiado = Math.max(monto - engancheReal, 0)
  if (financiado === 0 || plazo <= 0) {
    return { financiado: 0, mensualidad: 0, intereses: 0, total: centavos(engancheReal) }
  }
  const r = tasaAnual / 12
  const mensualidad = r === 0 ? financiado / plazo : (financiado * r) / (1 - (1 + r) ** -plazo)
  const m = centavos(mensualidad)
  const pagado = m * plazo
  return {
    financiado: centavos(financiado),
    mensualidad: m,
    intereses: centavos(Math.max(pagado - financiado, 0)),
    total: centavos(engancheReal + pagado),
  }
}
