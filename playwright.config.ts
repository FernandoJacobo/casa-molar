import { defineConfig, devices } from '@playwright/test'

/** E2E contra el sitio generado (`npm run generate`), servido como en Cloudflare Pages. */
export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4500',
    channel: 'chrome',
    timezoneId: 'America/Mexico_City',
    locale: 'es-MX',
  },
  projects: [
    { name: 'movil', use: { ...devices['Pixel 7'], channel: 'chrome' } },
    { name: 'escritorio', use: { viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'npx serve .output/public -l 4500',
    url: 'http://localhost:4500',
    reuseExistingServer: true,
  },
})
