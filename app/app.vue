<script setup lang="ts">
import { site } from '~/config/site'

const route = useRoute()
const config = useRuntimeConfig()

useHead({
  titleTemplate: t => (t ? `${t} · ${site.nombre}` : `${site.nombre} — ${site.sufijo} (demo)`),
  link: [{ rel: 'canonical', href: computed(() => `${config.public.siteUrl}${route.path === '/' ? '' : route.path}`) }],
})

useSeoMeta({
  description: site.descripcion,
  ogSiteName: site.nombre,
  ogType: 'website',
  ogLocale: 'es_MX',
  ogImage: `${config.public.siteUrl}/og.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  robots: site.indexable ? 'index, follow' : 'noindex, nofollow',
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
