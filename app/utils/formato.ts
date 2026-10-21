const pesosFmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
const pesosCentavosFmt = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** $1,234 (sin centavos). */
export const pesos = (n: number) => pesosFmt.format(Math.round(n))

/** $1,234.50 */
export const pesosCentavos = (n: number) => pesosCentavosFmt.format(n)

/** "HH:mm" → minutos desde la medianoche. */
export function aMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

/** Minutos desde la medianoche → "HH:mm". */
export function aHHMM(minutos: number): string {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** "19:00" → "7:00 p. m." (formato de México). */
export function horaLegible(hhmm: string): string {
  const total = aMinutos(hhmm)
  const h = Math.floor(total / 60)
  const m = total % 60
  const sufijo = h < 12 ? 'a. m.' : 'p. m.'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`
}

/** 45 → "45 min"; 90 → "1 h 30 min". */
export function duracionLegible(minutos: number): string {
  if (minutos < 60) return `${minutos} min`
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  return m ? `${h} h ${m} min` : `${h} h`
}

/** "2026-10-21" a partir de componentes locales (sin pasar por UTC). */
export function fechaISO(fecha: Date): string {
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
}

/** "2026-10-21" → Date local a medianoche. */
export function desdeISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, (m ?? 1) - 1, d ?? 1)
}
