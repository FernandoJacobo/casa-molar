/**
 * Modo demo: el número es el placeholder o no es un número internacional válido (10–15 dígitos
 * sin ceros de relleno). En modo demo nunca se abre wa.me: se muestra una vista previa del mensaje.
 */
export function esModoDemo(numero: string | undefined | null, placeholder: string): boolean {
  const limpio = (numero ?? '').replace(/\D/g, '')
  if (!limpio || limpio === placeholder.replace(/\D/g, '')) return true
  if (!/^\d{10,15}$/.test(limpio)) return true
  // "52" + puros ceros, o puros ceros: también es relleno.
  return /^(52)?0+$/.test(limpio)
}

export type Campo = [etiqueta: string, valor: string | number | null | undefined]

/**
 * Mensaje con título en negritas (formato de WhatsApp) y una línea por campo.
 * Se omiten los campos vacíos.
 */
export function armarMensaje(titulo: string, campos: Campo[], cierre?: string): string {
  const lineas = campos
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(([k, v]) => `• ${k}: ${String(v).trim()}`)
  return [`*${titulo}*`, '', ...lineas, ...(cierre ? ['', cierre] : [])].join('\n')
}

export function enlaceWhatsapp(numero: string, texto: string): string {
  return `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`
}
