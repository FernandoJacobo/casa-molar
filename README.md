# Casa Molar · Odontología (demo)

Sitio de demostración para una clínica dental de barrio en Zapopan. **Todos los datos son ficticios** (ver [DATOS-FICTICIOS.md](DATOS-FICTICIOS.md)).

## Concepto: el odontograma y la guía de tonos

La identidad sale de dos herramientas que hay en cualquier consultorio:

- **El odontograma**: las 32 piezas dibujadas en vista oclusal, con su número FDI. Es la ilustración del hero, la herramienta interactiva central, el selector de piezas del plan y el mapa del cronómetro.
- **La guía de tonos**: las 16 muestras B1…C4 se vuelven un simulador de blanqueamiento.

Visualmente es una clínica limpia y profesional: blanco, petróleo y niebla, titulares en Newsreader y texto en Figtree, líneas finas y una sola sombra suave. Sin fotos de stock: todo es SVG dibujado para este proyecto. Ver [DISENO.md](DISENO.md).

## Páginas

| Ruta | Qué hace |
| --- | --- |
| `/` | Hero con arcada, odontograma interactivo (32 piezas, teclado), simulador de tonos, índice de 9 tratamientos, antes/después, primera visita en minutos, placa radiográfica anotada, equipo, reseñas (ficticias), preguntas, CTA con días disponibles. |
| `/tratamientos`, `/tratamientos/[slug]` | 9 tratamientos con etapas, cuidados, preguntas, revisiones y precio "desde". |
| `/precios` | Lista de precios, **plan de tratamiento** eligiendo piezas en el odontograma (se guarda en el navegador, imprimible) y **calculadora de financiamiento** (MSI y con tasa, amortización francesa). |
| `/cita` | Agendador: motivo, profesional, calendario de 21 días, horarios calculados (horario − comida − citas simuladas − duración), validación en vivo, tarjeta de confirmación, `.ics`, WhatsApp (demo), reagendar y cancelar. |
| `/cepillado` | Cronómetro de 2 minutos por cuadrantes, vibración, modo peques, funciona sin conexión. |
| `/equipo`, `/aviso-de-privacidad`, 404 | Equipo con avatares dibujados; aviso genérico; "Esta página no tiene caries, pero tampoco existe." |

## Stack

- Nuxt 4 (prerender estático, `nitro.preset: static`) + Vue 3 + TypeScript
- Tailwind CSS 4 (solo tokens en `@theme`; los estilos viven en cada componente)
- @nuxt/fonts: Newsreader (titulares) y Figtree (texto y cifras)
- @vueuse/nuxt, date-fns
- Vitest (lógica pura) y Playwright (e2e contra el sitio generado)

## Correr en local

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # 34 pruebas de lógica (agenda, plan, financiamiento, .ics, tonos…)
npm run generate     # sitio estático en .output/public
npm run e2e          # Playwright contra .output/public (usa Chrome instalado)
npm run qa -- http://localhost:3000 /,/cita 390,768,1440   # capturas en qa/capturas
```

Requiere Node 24 (`.node-version`).

## WhatsApp

Copia `.env.example` a `.env`:

```bash
NUXT_PUBLIC_WHATSAPP=520000000000
```

Mientras el número sea el de ejemplo (`520000000000`), el sitio está en **modo demo**: los botones de WhatsApp abren una vista previa del mensaje y nunca abren `wa.me`. Con un número real (formato internacional sin `+`, p. ej. `5233…`) abren WhatsApp con el mensaje armado.

## Despliegue en Cloudflare Pages

- Comando de build: `npm run generate`
- Directorio de salida: `.output/public`
- Variable de entorno (opcional): `NUXT_PUBLIC_WHATSAPP`

El build genera `robots.txt` y `_headers` según `site.indexable`.

## Adaptarlo a una clínica real

1. `app/config/site.ts`: nombre, teléfonos, dirección, horario, cédula, responsable, financiamiento, `url`.
2. `app/data/`: tratamientos y precios, equipo, reseñas, preguntas.
3. Cuando todo sea real, `indexable: true` en `site.ts`: quita el `noindex`, abre `robots.txt`, genera `sitemap.xml` y activa el JSON-LD (`Dentist`, `Service`, `FAQPage`).
4. Fotos: ver [FOTOS-REALES.md](FOTOS-REALES.md).
5. El agendador usa citas simuladas deterministas (`app/utils/agenda.ts`). Para producción, `horariosDisponibles` debe recibir las citas reales de la agenda de la clínica.

## Decisiones

- **Sitio estático, sin backend.** Las citas y el plan se guardan en `localStorage`; la página lo dice. Lo que depende de la fecha de hoy (calendario, "abierto ahora", días del CTA) se calcula en el navegador y en la zona horaria de la clínica.
- **Query al montar.** Las páginas se prerenderizan sin query; `?motivo=`, `?pieza=`, `?agregar=` se aplican en `onMounted`.
- **CSS de entrada en línea.** Un hook de `prerender:done` mete la hoja principal dentro de cada HTML para quitar una petición que bloquea el pintado.
- **Secciones diferidas.** Las secciones bajo el pliegue de inicio se hidratan al verse (`hydrate-on-visible`).
- **Cronómetro sin conexión.** Un service worker mínimo guarda la página y sus archivos al visitarla.

## Calidad

- Lighthouse móvil (simulado, local): rendimiento 90–94, accesibilidad 100 en todas las páginas, buenas prácticas 100. SEO marca 66 a propósito por el `noindex` del demo.
- Responsive de 360 a 1536 px sin scroll horizontal (verificado con `npm run qa` y en e2e).
- Auditoría visual: [AUDITORIA-DISENO.md](AUDITORIA-DISENO.md). Contrato de diseño: [DISENO.md](DISENO.md).

---

Demo desarrollado por [Jacobodev](https://jacobodev.pages.dev).
