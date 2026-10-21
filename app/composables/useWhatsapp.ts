import { site } from '~/config/site'
import { enlaceWhatsapp, esModoDemo } from '~/utils/whatsapp'

export interface VistaPreviaWhatsapp {
  titulo: string
  texto: string
}

/**
 * Envía un mensaje por WhatsApp. En modo demo (número placeholder) NO abre wa.me:
 * muestra el modal "Vista previa del mensaje".
 */
export function useWhatsapp() {
  const config = useRuntimeConfig()
  const numero = String(config.public.whatsapp ?? '')
  const demo = esModoDemo(numero, site.whatsappPlaceholder)
  const vista = useState<VistaPreviaWhatsapp | null>('whatsapp-vista', () => null)

  function enviar(texto: string, titulo = 'Vista previa del mensaje') {
    if (demo) {
      vista.value = { titulo, texto }
      return
    }
    window.open(enlaceWhatsapp(numero, texto), '_blank', 'noopener')
  }

  /** Para enlaces directos (barra móvil): `null` en modo demo. */
  const enlace = (texto: string) => (demo ? null : enlaceWhatsapp(numero, texto))

  return { demo, enviar, enlace, vista, cerrar: () => (vista.value = null) }
}
