/** Diagnóstico: carga una ruta, recorre la página y muestra errores de consola. Uso: node scripts/consola.mjs <url> [selector] */
import { existsSync } from 'node:fs'
import puppeteer from 'puppeteer-core'

const [url = 'http://localhost:3700/', selector] = process.argv.slice(2)
const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', process.env.CHROME_PATH].filter(Boolean).find(p => existsSync(p))
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--headless=new'] })
const page = await browser.newPage()
page.on('console', m => ['error', 'warning', 'warn'].includes(m.type()) && console.log(`[${m.type()}] ${m.text()}`))
page.on('pageerror', e => console.log(`[pageerror] ${e.message}`))
await page.setViewport({ width: 1280, height: 900 })
await page.goto(url, { waitUntil: 'networkidle0' })
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    window.scrollTo(0, y)
    await new Promise(r => setTimeout(r, 80))
  }
})
await new Promise(r => setTimeout(r, 1500))
if (selector) console.log(await page.$$eval(selector, els => els.map(e => e.textContent?.trim().slice(0, 200))))
await browser.close()
