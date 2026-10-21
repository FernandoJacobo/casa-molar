# Fotos reales: cuándo y cómo

El demo no usa fotografías: todo es ilustración SVG. Para una clínica real, las fotos sí suman confianza, pero solo si son **de la clínica**. Nunca stock: una sonrisa de banco de imágenes es lo primero que un paciente reconoce como falso.

## Qué fotografiar (en orden de impacto)

1. **El equipo, en su sillón y con su ropa de trabajo.** Reemplaza `AvatarSvg` en `/equipo` y en "Quién te atiende". Luz de ventana, fondo del propio consultorio, sin pose de estudio.
2. **La fachada y la puerta**, como se ven desde la banqueta. Va junto al mapa ilustrado (no lo sustituye): ayuda a encontrar el lugar.
3. **La sala de espera y un gabinete** tal como están un martes cualquiera.
4. **Casos antes/después reales**, con consentimiento informado por escrito, misma luz, mismo encuadre y sin retoque. Sustituyen a `SonrisaSvg` en `AntesDespues.vue`.
5. **Detalles de papelería**: la tarjeta de cita impresa, la guía de tonos en la mano de la doctora.

## Cómo integrarlas sin romper la identidad

- Tratamiento uniforme: ligeramente cálidas, grano leve; que conversen con el marfil y el hueso.
- Marco de papelería: borde de 1.5 px en tinta y la sombra de cartón (`--shadow-carton`), como el resto de los objetos.
- Formatos: AVIF/WebP con `<NuxtImg>` (añadir `@nuxt/image`), `width`/`height` explícitos, `loading="lazy"` excepto la primera.
- Texto alternativo que describa la escena ("La Dra. Larrondo revisando una radiografía en el gabinete 2"), no "foto de dentista".
- Mantén las ilustraciones donde explican algo (odontograma, placa, tratamientos): la foto muestra el lugar; el dibujo explica el procedimiento.

## Permisos

- Consentimiento por escrito de cada persona que aparezca, pacientes incluidos.
- Las fotos clínicas son datos de salud: menciónalo en el aviso de privacidad.
