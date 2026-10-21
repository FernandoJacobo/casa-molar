# Auditoría de diseño

Revisión final contra el contrato de [DISENO.md](DISENO.md) y la lista negra del brief. Capturas de QA a 360, 390, 768, 1024, 1280, 1440 y 1536 px (`npm run qa`), dos rondas de crítica.

## 1. Sección por sección

| Sección | Composición | Recurso propio |
| --- | --- | --- |
| Cinta superior | Franja mono con regla milimétrica; estado "abierto ahora" calculado en hora de la clínica. | Regla de medición (trazos duros, sin degradado). |
| Encabezado | Logo a la izquierda, navegación con números FDI (11/21/31/41) como superíndice. En móvil, botón "Menú". | Numeración dental como sistema de navegación. |
| Hero (§ 11) | Asimétrico: titular gigante a la izquierda, arcada superior girada que sale del borde derecho, tarjeta de cita apoyada en diagonal. Nada centrado y sin cifras de "+10 años". | Arcada con numeración y nota manuscrita "esta es la 11". |
| Odontograma (§ 12) | Herramienta a ancho completo con panel de ficha al lado; en móvil, pestañas superior/inferior con zoom del viewBox. | 32 piezas, teclado completo, lista accesible alternativa. |
| Tonos (§ 13) | Franja horizontal de 16 muestras con lengüeta; código gigante del tono detrás de la sonrisa. | Guía de tonos B1…C4 convertida en simulador. |
| Índice de tratamientos (§ 14) | Lista numerada T-01…T-09 tipo índice de libro, filas que se despliegan; no es una rejilla de tarjetas. | Códigos de tratamiento y precio "desde" en mono. |
| Antes/después (§ 15) | Comparador de deslizar con una sola ilustración partida. | Sonrisa SVG con tono variable. |
| Primera visita (§ 16) | Barra de tiempo proporcional a los minutos (10/15/10/10); cada tramo es una pestaña. | Línea de tiempo en minutos reales. |
| Placa (§ 17) | Única sección oscura: radiografía panorámica dibujada con anotaciones numeradas. | Placa radiográfica. |
| Equipo (§ 18) | Escalera de retratos desfasados, no rejilla. | Avatares con silueta de corona molar. |
| Reseñas (§ 21) | Burbujas de chat estáticas paciente/clínica, sin carrusel, cada una marcada "(reseña ficticia)". | Conversación de WhatsApp. |
| Preguntas (§ 22) | `<details>` nativos con enlaces a la página relacionada. | — |
| CTA (§ 23) | Motivo + 6 próximos días hábiles reales, marca de agua de la arcada. | Lleva a `/cita` con la selección prellenada. |
| Pie | Nombre gigante a sangre, mapa ilustrado, aviso de demo. | Mapa de calles inventadas. |
| `/precios` | Lista de dos columnas con guiones de relleno (menú de recetario), hoja de plan imprimible con odontograma marcado, calculadora en bloque tinta. | Hoja de plan con folio. |
| `/cita` | Formulario en una sola tarjeta con pasos 01–05 y columna lateral fija con horario, urgencias y mapa. | Calendario con días cerrados rayados; confirmación en tarjeta de cita. |
| `/cepillado` | Dial con 4 arcos (un cuadrante cada uno) alrededor de las dos arcadas; reloj mono enorme. | Cuadrante FDI activo resaltado. |
| 404 | Titular + sillón dental ilustrado "Sillón 3 · libre". | Chiste dental. |

## 2. Lista negra

| Prohibido | Estado |
| --- | --- |
| Inter, Poppins, Montserrat, Roboto, Open Sans… | ✅ Solo Young Serif, Hanken Grotesk y Spline Sans Mono. |
| Azul "clínico" | ✅ Paleta marfil/hueso/arena/tinta/coral/menta. El único azul es `--color-placa-linea`, dentro de la radiografía. |
| Degradados | ✅ Ningún `linear-gradient` ni `radial-gradient` decorativo. Excepciones técnicas con cortes duros (sin transición de color): `repeating-linear-gradient` para la regla de la cinta, los rayados de días cerrados y del tramo de anestesia, y un `radial-gradient` de cortes duros que dibuja las perforaciones de la tarjeta de cita. |
| Glow, blur, glassmorphism | ✅ Ninguno. `::backdrop` del modal es un velo plano. |
| Rejillas de tarjetas iguales | ✅ Índice en lista, equipo en escalera, precios en lista de recetario. |
| Hero centrado con estadísticas | ✅ Hero asimétrico sin cifras. |
| Pills | ✅ Botones rectos con sombra de cartón; horas y plazos con forma de muestra (recto arriba, redondeado abajo). |
| Radios uniformes | ✅ 2 px, 6 px, forma de muestra, burbuja asimétrica, silueta de corona; ver conteo en `git grep border-radius`. |
| Lucide u otros sets de iconos | ✅ Sin librería de iconos; los pocos glifos son SVG propios. |
| Fotos de stock | ✅ Cero fotos. |
| Carrusel de reseñas | ✅ Reseñas estáticas. |
| Fade-up al hacer scroll | ✅ Sin animaciones de entrada. Movimiento solo con significado: destello que recorre las piezas una vez, transición del tono, botón que se hunde. Todo respeta `prefers-reduced-motion`. |
| Interruptor de modo oscuro | ✅ Un solo tema. |
| Frases vacías ("tu sonrisa, nuestra pasión") | ✅ Textos concretos: minutos, precios, pasos. |
| Emojis | ✅ Ninguno (se quitó uno de una reseña en la primera ronda). |
| Librerías de componentes | ✅ Todo a mano; `<dialog>` y `<details>` nativos. |

## 3. Cambios por las rondas de QA

**Primera ronda (inicio, tratamientos, equipo):**

- La sonrisa parecía caricatura: labios hueso, encía coral, dientes más anchos y caninos sin forma de colmillo.
- Huecos entre piezas de la arcada y tapas de encía con forma de gota: nueva separación y extremos rectos.
- `svg { overflow: visible }` global rompía el recorte del odontograma en móvil: se quitó.
- Comparador antes/después con un `calc()` inválido: variable sin unidades.
- La escalera del equipo no se aplicaba (especificidad): selector corregido.
- Ajustes de composición: pie de figura del hero dentro del hueco de la arcada, marca de agua del CTA sin rotar, nombre gigante del pie más chico, títulos con guiones automáticos.
- Muestras de tono con radio menor (parecían pills).

**Segunda ronda (todas las páginas, 360–1536):**

- 360 px: el índice de tratamientos y la barra de primera visita desbordaban 8 px (`1fr` sin `minmax(0, …)`, palabras largas).
- 768 px: el logo se partía en dos líneas; el encabezado oculta los números FDI entre 768 y 1023 px.
- `/precios` a 390 px: la calculadora desbordaba por el ancho intrínseco de los inputs.
- `/cita` en el sitio estático no aplicaba `?motivo=`: la query se lee al montar.
- `/cepillado` en móvil: el dial quedaba fuera de pantalla al empezar; dial más chico y desplazamiento al iniciar. En modo peques, el resaltado menta no se veía sobre fondo menta: pasa a coral.
- Lighthouse: `coral-oscuro` a `#9E3E2A` (4.4 → 5.6:1), coral de titulares a `#CC573E` (≥ 3:1), marca "hoy" del simulador era marfil sobre hueso (invisible), encabezados de la lista de precios a `h2`.

## 4. Pendiente o mejorable

- La imagen `og.png` es una captura del hero a 1200×630; una composición dedicada quedaría mejor.
- Rendimiento móvil de inicio con margen corto (90–91 en Lighthouse local): el HTML prerenderizado del inicio es grande por los SVG en línea. Se puede mover el sprite de piezas a un archivo externo cacheable.
