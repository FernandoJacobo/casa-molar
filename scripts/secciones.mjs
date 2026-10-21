/**
 * Captura cada <section> de una página por separado.
 *   node scripts/secciones.mjs <url> <ancho> <prefijo>
 */
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const [url = 'http://localhost:3700/', ancho = '1440', prefijo = 'sec'] = process.argv.slice(2)
mkdirSync('qa/capturas', { recursive: true })
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const p = await b.newPage()
await p.setViewport({ width: Number(ancho), height: 900, isMobile: Number(ancho) < 768, hasTouch: Number(ancho) < 768 })
await p.goto(url, { waitUntil: 'networkidle0' })
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)) }
  window.scrollTo(0, 0)
})
await new Promise(r => setTimeout(r, 1500))
const els = await p.$$('main section:not(section section), header.encabezado, footer')
let i = 0
for (const el of els) {
  const box = await el.boundingBox()
  if (!box || box.height < 20) continue
  await el.screenshot({ path: `qa/capturas/${prefijo}-${String(i++).padStart(2, '0')}.png` })
}
console.log(i, 'capturas')
await b.close()
