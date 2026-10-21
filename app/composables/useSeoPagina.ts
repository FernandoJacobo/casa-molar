import { site } from '~/config/site'

/** Título, descripción y Open Graph por página; `noindex` lo pone app.vue según `site.indexable`. */
export function useSeoPagina(titulo: string, descripcion: string) {
  useSeoMeta({
    title: titulo,
    description: descripcion,
    ogTitle: `${titulo} · ${site.nombre}`,
    ogDescription: descripcion,
  })
}

/** JSON-LD solo si el sitio es indexable (cliente real). */
export function useJsonLd(datos: () => Record<string, unknown>) {
  if (!site.indexable) return
  useHead({ script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(datos()) }] })
}
