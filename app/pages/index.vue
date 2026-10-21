<script setup lang="ts">
import { site } from '~/config/site'
import { preguntas } from '~/data/contenido'

useSeoMeta({
  title: null,
  ogTitle: `${site.nombre} — ${site.sufijo} (demo)`,
  description: site.descripcion,
  ogDescription: site.descripcion,
})

if (site.indexable) {
  useHead({
    script: [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': preguntas.map(p => ({ '@type': 'Question', 'name': p.pregunta, 'acceptedAnswer': { '@type': 'Answer', 'text': p.respuesta } })),
      }),
    }],
  })
}
</script>

<template>
  <div>
    <InicioHeroInicio />
    <InicioSeccionOdontograma />
    <LazyInicioSeccionTonos hydrate-on-visible />
    <LazyInicioIndiceTratamientos hydrate-on-visible />
    <LazyInicioAntesDespues hydrate-on-visible />
    <LazyInicioPrimeraVisita hydrate-on-visible />
    <InicioPlacaRadiografica />
    <InicioQuienesAtienden />
    <InicioLoQueEscriben />
    <LazyInicioPreguntasFrecuentes hydrate-on-visible />
    <LazyInicioCtaCita hydrate-on-visible />
  </div>
</template>
