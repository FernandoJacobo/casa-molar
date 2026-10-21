# Datos ficticios

Este sitio es una demostración. **Nada de lo que aparece corresponde a una clínica, persona o marca real.**

| Dato | Valor en el demo | Dónde se cambia |
| --- | --- | --- |
| Nombre | Casa Molar · Odontología | `app/config/site.ts` |
| Teléfono y urgencias | 33 0000 0000 | `site.telefono`, `site.urgencias` |
| WhatsApp | 520000000000 (modo demo: solo vista previa) | `NUXT_PUBLIC_WHATSAPP` |
| Correo | hola@clinica-demo.example (dominio reservado `.example`) | `site.correo` |
| Dirección | Av. Ejemplo 123, Col. Demo, Zapopan, Jalisco | `site.direccion` |
| Mapa | Ilustración SVG con calles inventadas (C. Muestra, C. Prueba, C. Boceto, Parque Demo). No usa Google Maps. | `MapaIlustrado.vue`, `site.mapa` |
| Cédulas | DEMO-0000000 y DEMO-000000x | `site.cedula`, `app/data/equipo.ts` |
| Responsable sanitario | Dra. Ifigenia Larrondo (ficticia) | `site.responsable` |
| Equipo | 4 profesionales inventados, con avatares dibujados | `app/data/equipo.ts` |
| Reseñas | 6, cada una marcada "(reseña ficticia)" | `app/data/contenido.ts` |
| Precios | Ilustrativos, en MXN, "desde" | `app/data/tratamientos.ts`, `contenido.ts` |
| Financiamiento | Plazos y tasa de ejemplo (18 % anual) | `site.financiamiento` |
| Citas | Ocupación simulada y determinista; las citas del usuario solo se guardan en su navegador | `app/utils/agenda.ts` |
| Redes sociales | Enlaces `#` | `site.redes` |
| Aviso de privacidad | Texto genérico de ejemplo; revisar con un abogado | `app/pages/aviso-de-privacidad.vue` |

## Protecciones mientras sea demo (`site.indexable = false`)

- Aviso visible en el pie de todas las páginas.
- `<meta name="robots" content="noindex, nofollow">` y cabecera `X-Robots-Tag` (`_headers`).
- `robots.txt` con `Disallow: /`.
- Sin `sitemap.xml` y sin JSON-LD.
- WhatsApp en modo demo: nunca abre `wa.me`.

No se usan marcas comerciales de productos dentales, instituciones ni universidades reales.
