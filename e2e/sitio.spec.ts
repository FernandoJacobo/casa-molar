import { expect, test } from '@playwright/test'

const RUTAS = ['/', '/tratamientos', '/tratamientos/endodoncia', '/precios', '/cita', '/cepillado', '/equipo', '/aviso-de-privacidad']

for (const ruta of RUTAS) {
  test(`${ruta} carga sin errores, sin scroll horizontal y con aviso de demo`, async ({ page }) => {
    const errores: string[] = []
    page.on('pageerror', e => errores.push(e.message))
    page.on('console', m => m.type() === 'error' && errores.push(m.text()))
    await page.goto(ruta)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('footer').getByText('Sitio de demostración.')).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(desborde).toBeLessThanOrEqual(0)
    expect(errores).toEqual([])
  })
}

test('robots.txt bloquea todo y no hay sitemap', async ({ request }) => {
  expect(await (await request.get('/robots.txt')).text()).toContain('Disallow: /')
  expect((await request.get('/sitemap.xml')).status()).not.toBe(200)
})

test('404 con mensaje propio', async ({ page }) => {
  await page.goto('/no-existe-esta-pagina')
  await expect(page.getByRole('heading', { name: /no tiene caries, pero tampoco existe/ })).toBeVisible()
})

test('odontograma: elegir pieza con teclado muestra su ficha', async ({ page }) => {
  await page.goto('/')
  const pieza = page.locator('[role="button"][aria-pressed]').first()
  await pieza.scrollIntoViewIfNeeded()
  await pieza.focus()
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  await expect(page.locator('[role="button"][aria-pressed="true"]')).toHaveCount(1)
  await expect(page.getByRole('link', { name: /Revisar esta pieza/ })).toBeVisible()
})

test('agendar: validación, confirmación, .ics, WhatsApp en modo demo y cancelar', async ({ page }) => {
  await page.goto('/cita?motivo=limpieza')
  await expect(page.locator('select')).toHaveValue('limpieza')

  await page.getByRole('button', { name: 'Confirmar cita' }).click()
  await expect(page.getByText('Elige un día.', { exact: true })).toBeVisible()

  await page.locator('.cal__dia:not(:disabled)').nth(1).click()
  await page.locator('.hora').first().click()
  await page.getByLabel('Nombre').fill('Paciente Prueba')
  await page.getByLabel('Teléfono (10 dígitos)').fill('33 0000 00')
  await page.getByLabel('Teléfono (10 dígitos)').blur()
  await expect(page.getByText('El teléfono debe tener 10 dígitos.')).toBeVisible()
  await page.getByLabel('Teléfono (10 dígitos)').fill('3300000000')
  await page.getByRole('button', { name: 'Confirmar cita' }).click()

  const conf = page.locator('#confirmacion')
  await expect(conf).toContainText('Listo, Paciente.')
  await expect(conf).toContainText(/CM-[0-9A-Z]+/)

  const [descarga] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /Descargar para mi calendario/ }).click(),
  ])
  expect(descarga.suggestedFilename()).toMatch(/^cita-CM-.+\.ics$/)

  // Modo demo: abre la vista previa, nunca wa.me.
  await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click()
  await expect(page.locator('dialog[open]')).toContainText('Paciente Prueba')
  await page.keyboard.press('Escape')

  await page.reload()
  await expect(page.locator('.mis__cita')).toHaveCount(1)
  await page.getByRole('button', { name: 'Cancelar' }).click()
  await expect(page.locator('.mis__cita')).toHaveCount(0)
})

test('?agregar añade el tratamiento al plan', async ({ page }) => {
  await page.goto('/precios?agregar=resinas#plan')
  await expect(page.locator('#plan')).toContainText('Resinas')
})

test('cepillado: empieza, cambia el reloj y se pausa', async ({ page }) => {
  await page.clock.install()
  await page.goto('/cepillado')
  await page.getByRole('button', { name: 'Empezar' }).click()
  await page.clock.runFor(31_000)
  await expect(page.getByText(/Cuadrante 2/)).toBeVisible()
  await page.getByRole('button', { name: 'Pausar' }).click()
  await expect(page.getByRole('button', { name: 'Seguir' })).toBeVisible()
})
