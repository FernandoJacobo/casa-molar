/**
 * QA visual: capturas de página completa y aviso de scroll horizontal.
 *
 *   npm run qa -- <base> <rutas> <anchos> [--alto=N] [--sin-completa] [--reducido]
 *   npm run qa -- http://localhost:3700 /,/precios 390,768,1440
 *
 * Salida: qa/capturas/<ruta>-<ancho>.png
 */
import { existsSync, mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const args = process.argv.slice(2)
const flags = Object.fromEntries(args.filter(a => a.startsWith('--')).map(a => {
  const [k, v] = a.slice(2).split('=')
  return [k, v ?? true]
}))
const [base = 'http://localhost:3700', rutas = '/', anchos = '390,768,1440'] = args.filter(a => !a.startsWith('--'))

const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean).find(p => existsSync(p))
if (!chrome) throw new Error('No se encontró Chrome. Define CHROME_PATH.')

const salida = 'qa/capturas'
mkdirSync(salida, { recursive: true })

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--headless=new'] })
const page = await browser.newPage()
if (flags.reducido) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])

for (const ruta of rutas.split(',')) {
  for (const ancho of anchos.split(',').map(Number)) {
    await page.setViewport({ width: ancho, height: Number(flags.alto ?? 900), deviceScaleFactor: 1, isMobile: ancho < 768, hasTouch: ancho < 768 })
    await page.goto(base + ruta, { waitUntil: 'networkidle0' })
    await page.evaluate(() => document.fonts.ready)
    // Recorre la página para hidratar secciones diferidas.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y)
        await new Promise(r => setTimeout(r, 60))
      }
      window.scrollTo(0, 0)
    })
    await new Promise(r => setTimeout(r, 1800))
    const desborde = await page.evaluate(() => {
      const w = document.documentElement.clientWidth
      const culpables = [...document.querySelectorAll('body *')]
        .filter(el => el.getBoundingClientRect().right > w + 1 && getComputedStyle(el).position !== 'fixed')
        .slice(0, 5)
        .map(el => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`)
      return { scroll: document.documentElement.scrollWidth > w, culpables }
    })
    const nombre = `${ruta === '/' ? 'inicio' : ruta.replace(/^\//, '').replace(/\//g, '_')}-${ancho}`
    await page.screenshot({ path: `${salida}/${nombre}.png`, fullPage: !flags['sin-completa'] })
    console.log(`${nombre}${desborde.scroll ? `  ⚠ scroll horizontal: ${desborde.culpables.join(', ')}` : ''}`)
  }
}

await browser.close()
