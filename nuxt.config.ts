import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { site } from './app/config/site'
import { tratamientos } from './app/data/tratamientos'

const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || site.url).replace(/\/+$/, '')

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },

  // El sitemap solo existe cuando el sitio puede indexarse (cliente real).
  modules: ['@nuxt/fonts', '@vueuse/nuxt', ...(site.indexable ? ['@nuxtjs/sitemap'] : [])],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    public: {
      siteUrl,
      // NUXT_PUBLIC_WHATSAPP en .env. Con el placeholder, el sitio está en modo demo (no abre wa.me).
      whatsapp: process.env.NUXT_PUBLIC_WHATSAPP || site.whatsappPlaceholder,
    },
  },

  ...(site.indexable ? { site: { url: siteUrl, name: site.nombre, defaultLocale: 'es-MX' }, sitemap: { zeroRuntime: true } } : {}),

  app: {
    head: {
      htmlAttrs: { lang: 'es-MX' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#FFFFFF' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  fonts: {
    families: [
      { name: 'Newsreader', provider: 'google', weights: [500] },
      { name: 'Figtree', provider: 'google', weights: [400, 600, 700] },
    ],
    defaults: { subsets: ['latin'], styles: ['normal'], fallbacks: { 'serif': ['Georgia'], 'sans-serif': ['Arial'] } },
  },

  typescript: { strict: true, typeCheck: false },

  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      // `/precios` → `precios.html`: Cloudflare Pages lo sirve sin redirigir a la versión con "/".
      autoSubfolderIndex: false,
      routes: ['/', '/404.html', ...tratamientos.map(t => `/tratamientos/${t.slug}`)],
    },
  },

  hooks: {
    'build:manifest'(manifest) {
      for (const chunk of Object.values(manifest)) chunk.prefetch = false
    },
    'nitro:init'(nitro) {
      nitro.hooks.hook('prerender:done', () => {
        const publicDir = nitro.options.output.publicDir

        // robots.txt según `site.indexable`.
        writeFileSync(
          join(publicDir, 'robots.txt'),
          site.indexable
            ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
            : 'User-agent: *\nDisallow: /\n',
        )

        // Cabeceras de Cloudflare Pages; el noindex también va por cabecera mientras el sitio sea demo.
        writeFileSync(
          join(publicDir, '_headers'),
          [
            '/*',
            ...(site.indexable ? [] : ['  X-Robots-Tag: noindex, nofollow']),
            '  X-Content-Type-Options: nosniff',
            '  Referrer-Policy: strict-origin-when-cross-origin',
            '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
            '',
            '/_nuxt/*',
            '  Cache-Control: public, max-age=31536000, immutable',
            '',
            '/_fonts/*',
            '  Cache-Control: public, max-age=31536000, immutable',
            '',
            '/sw.js',
            '  Cache-Control: no-cache',
            '',
          ].join('\n'),
        )

        // Inserta la hoja de estilos de entrada dentro de cada HTML: una petición menos que bloquea el pintado.
        const dirs = [publicDir, ...nitro.options.publicAssets.map(a => a.dir)]
        const leerCss = (href: string) => {
          for (const dir of dirs) {
            for (const candidato of [join(dir, href), join(dir, href.replace(/^\/_nuxt/, ''))]) {
              try {
                return readFileSync(candidato, 'utf8')
              }
              catch {
                // Sigue con el siguiente directorio.
              }
            }
          }
          return null
        }
        const recorrer = (dir: string): string[] =>
          readdirSync(dir, { withFileTypes: true }).flatMap(e =>
            e.isDirectory() ? (e.name === '_nuxt' ? [] : recorrer(join(dir, e.name))) : e.name.endsWith('.html') ? [join(dir, e.name)] : [],
          )
        for (const path of recorrer(publicDir)) {
          const html = readFileSync(path, 'utf8')
          const nuevo = html.replace(/<link rel="stylesheet" href="(\/_nuxt\/entry\.[\w-]+\.css)"[^>]*>/, (tag, href: string) => {
            const css = leerCss(href)
            return css ? `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>` : tag
          })
          if (nuevo !== html) writeFileSync(path, nuevo)
        }
      })
    },
  },
})
