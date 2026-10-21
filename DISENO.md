# DISENO.md — Casa Molar · Odontología (demo)

Contrato de dirección de arte. Si algo en la UI contradice este documento, gana el documento (o se actualiza aquí con la razón).

## 1. Concepto: "El odontograma y la guía de tonos"

El sitio no se disfraza de "clínica moderna": usa los objetos de trabajo del propio consultorio, que casi ninguna web dental usa.

| Objeto real | Cómo vive en el sitio |
|---|---|
| **Odontograma** (32 piezas, numeración FDI) | Espina dorsal: cada sección del inicio se numera con un código de pieza (`§ 11`, `§ 12`…); la arcada (curva en U) es la forma gráfica recurrente; el odontograma es la herramienta interactiva central. |
| **Guía de tonos** (muestras A1…D4) | Sistema de color del sitio (el fondo es "A1"), pestañas con forma de muestra (rectángulo con lengüeta y orificio) y el simulador de blanqueamiento. |
| **Placa radiográfica** | Una sola sección oscura (`--placa`) para hablar de tecnología, con trazos claros y anotaciones con flecha. |
| **Tarjeta de cita** | Cartón crema con perforación lateral, renglones y folio: forma de la CTA del hero, del agendador y de la confirmación. |

Tono: cálido, boutique, tranquilo, humano. Consultorio de diseño bien cuidado, nunca hospital.

## 2. Tokens (un solo tema, sin modo oscuro)

| Token | Valor | Uso |
|---|---|---|
| `--color-marfil` | `#F4ECDD` | fondo principal (tono "A1") |
| `--color-hueso` | `#E9DEC8` | superficies, secciones alternas |
| `--color-arena` | `#D9C9A8` | líneas, bordes, puntos guía |
| `--color-tinta` | `#1D2326` | texto, trazos, ilustración |
| `--color-tinta-suave` | `#4A5154` | texto secundario (AA sobre marfil y hueso) |
| `--color-coral` | `#E2674D` | acento (encía): CTA, números destacados, trazo de acento |
| `--color-coral-oscuro` | `#B84A33` | texto pequeño en coral (AA) |
| `--color-menta` | `#BFE0D4` | solo rellenos puntuales (frescura): cuadrante activo del cronómetro, marcas de "sano" |
| `--color-placa` | `#0E181D` | fondo de la sección radiográfica |
| `--color-placa-linea` | `#8FC4D0` | trazos de la placa |
| `--color-placa-texto` | `#CFE3E8` | texto sobre la placa |

Radios **intencionales y variados**, nunca uniformes:
- `--radius-recto: 2px` (filas de índice, inputs, hoja de plan).
- `--radius-muestra: 2px 2px 40% 40% / 2px 2px 28% 28%` (pestaña de tono: recta arriba, redondeada abajo como la muestra real).
- `--radius-tarjeta: 6px` (tarjeta de cita: cartón con esquinas apenas gastadas).
- `--radius-burbuja`: asimétrico (18px 18px 18px 3px) en las reseñas.
- Arcos completos solo donde la forma es una arcada o una pieza.

Sombras: una sola, dura y desplazada (`--shadow-carton: 3px 4px 0 var(--color-arena)`) para objetos de cartón. Sin sombras difusas.

Materiales: grano de papel muy leve (SVG `feTurbulence` en `body::before`, opacidad 0.05), trazo de lápiz irregular en ilustraciones (`#trazo`: `feTurbulence` baseFrequency 0.9 + `feDisplacementMap` scale 1.2), marcas de medición (reglitas con ticks) en los bordes de algunas secciones.

## 3. Tipografía

| Rol | Familia | Pesos | Notas |
|---|---|---|---|
| Titulares | **Young Serif** | 400 | tracking −0.02em, interlínea 0.95–1.05 |
| Cuerpo | **Hanken Grotesk** | 400 / 500 / 700 | 17px base en móvil, 18px escritorio |
| Códigos, datos, etiquetas | **Spline Sans Mono** | 400 / 700 | `tabular-nums`, mayúsculas con tracking 0.08em en etiquetas |

Escala (con `clamp()`):
- `display`: clamp(4rem, 15vw, 13rem) — "Cuidamos las 32.", nombre del footer.
- `numeral`: clamp(5rem, 22vw, 18rem) — códigos FDI y de tono usados como gráfico (Young Serif o Mono 700).
- `h2`: clamp(2.4rem, 6vw, 4.6rem).
- `h3`: clamp(1.5rem, 3vw, 2.1rem).
- `cuerpo`: 1.06rem; `chico`: 0.875rem; `etiqueta` (mono): 0.72rem, mayúsculas.

## 4. Composiciones del inicio (cada sección, un layout distinto)

| § | Sección | Composición |
|---|---|---|
| — | Cinta superior | Franja mono de una línea, tinta sobre hueso, con la regla de medición en el borde inferior. |
| 11 | Hero | **Diagonal desbordada**: titular gigante alineado a la izquierda que se sale de su caja hacia la derecha y queda montado sobre una arcada enorme recortada por el borde derecho e inferior de la pantalla. CTA = tarjeta de cita girada −2°. Sin estadísticas. |
| 12 | Odontograma | **Instrumento centrado con panel lateral**: las dos arcadas enfrentadas como un esquema técnico, con la numeración FDI en el perímetro; panel de detalle que sale del lado derecho (abajo en móvil). |
| 13 | Guía de tonos | **Franja vertical a sangre**: las 16 muestras ocupan una columna de alto completo pegada al borde izquierdo; la sonrisa y los números del cálculo flotan a la derecha con un numeral de tono gigante de fondo. |
| 14 | Índice de tratamientos | **Lista de expediente + ilustración sticky**: filas de ancho completo (código, nombre serif, línea, "desde $") con la ilustración pegajosa en la columna derecha que cambia con la fila activa. |
| 15 | Antes/después | **Lienzo panorámico con corte**: comparador de ancho completo con el divisor como una línea de medición vertical y el texto en una columna estrecha superpuesta en la esquina. |
| 16 | Primera visita | **Gráfico de datos**: una barra horizontal proporcional de 45 min; los tramos son botones; debajo, una ficha con el detalle del tramo activo. Mucho vacío arriba. |
| 17 | Placa radiográfica | **Sección oscura de pantalla completa** con la panorámica en trazos claros y tres anotaciones con flechas que salen hacia los márgenes. |
| 18 | Quiénes te atienden | **Escalonada**: 4 profesionales en columnas desplazadas verticalmente (escalera), cada uno con su avatar recortado en forma de pieza y una pestaña-muestra. |
| 21 | Lo que nos escriben | **Conversación**: burbujas de chat alineadas a izquierda y derecha, de anchos distintos, sobre fondo hueso, como un hilo de mensajes. |
| 22 | Preguntas | **Dos columnas desiguales**: pregunta gigante en serif a la izquierda (la activa), lista de preguntas a la derecha; en móvil, acordeón. |
| 23 | Tarjeta de cita (CTA) | **Objeto único**: la tarjeta de cita grande, centrada pero girada, con la arcada como marca de agua. |
| — | Footer | **Nombre gigante cortado** por el borde inferior, sonrisa en línea, horarios, mapa ilustrado, aviso de demo y cintilla de crédito. |

Más de 7 composiciones distintas: 12 en total.

## 5. Catálogo de ilustraciones SVG (todas propias)

Trazo de línea fino (1.4–1.8 unidades), tinta `--color-tinta`, coral solo como acento, filtro `#trazo` para irregularidad leve.

1. **Piezas base, vista oclusal** (`<symbol>` en un sprite): incisivo central, incisivo lateral, canino, premolar, molar, cordal. Se escalan y giran a lo largo de una curva de arcada generada (`utils/arcada.ts`, parábola recorrida por longitud de arco).
2. **Piezas base, vista frontal con raíz**: incisivo, canino, premolar, molar (una y dos/tres raíces). Se usan en la placa radiográfica y en las ilustraciones de tratamientos.
3. **Arcada completa** (32 piezas, superior e inferior) para el hero, el odontograma y el cronómetro.
4. **Sonrisa frontal** (labios + 10 piezas visibles) con el color de las piezas como variable: simulador, antes/después (antes: piezas giradas y apiñadas; después: alineadas) y footer (solo línea).
5. **Ilustraciones de tratamiento** (9): compuestas con las piezas frontales + un objeto: punta de ultrasonido, resina, muestra de tono, alineador, brackets, tornillo de implante, carilla, conductos, cepillo pequeño.
6. **Avatares del equipo** (4): busto frontal de línea, rasgos mínimos y distintos (peinados, lentes, barba, aretes), recortados en forma de pieza.
7. **Mapa ilustrado**: calles ficticias, un parque, una parada, el punto "Aquí estamos".
8. **Panorámica radiográfica**: contorno mandibular, piezas con raíces en trazo claro.
9. **Sillón dental** (404 y `/cita`).
10. **Cepillo e hilo dental** (cronómetro y detalles).

## 6. Movimiento (poco y con sentido)

- **Destello único** en el hero: cada pieza de la arcada se aclara en secuencia (retardo por índice), una sola vez al cargar.
- **Odontograma**: la pieza se eleva (traslado hacia afuera de la arcada) y se rellena de menta al foco/hover; retroalimentación táctil (`navigator.vibrate(8)` donde exista).
- **Simulador**: transición de color de 600 ms en las piezas de la sonrisa.
- **Cronómetro**: el cuadrante activo se rellena de menta y un arco de progreso avanza.
- **Botones**: se hunden 2px y pierden la sombra de cartón al presionar.
- `prefers-reduced-motion`: sin destello, sin elevación (solo cambio de color), sin transiciones de color.

Sin fade-up por sección.

## 7. Reglas que no se rompen

- Nada de: Inter/Poppins/Manrope/Plus Jakarta/DM Sans/Space Grotesk/Outfit/Geist/Roboto/Bricolage; azul clínico + blanco; gradientes; glow; blobs; glassmorphism; cuadrículas de tarjetas idénticas con icono; hero centrado con 3 cifras; pills con puntito verde; radios uniformes de 16–24px; sombras difusas; bordes grises de 1px; Lucide/Heroicons; fotos de stock; carrusel de reseñas con estrellas; fade-up repetido; toggle de tema; textos vacíos; emojis; lorem ipsum; librerías de componentes.
- Todos los datos son ficticios (ver `DATOS-FICTICIOS.md`).
- Tema de Tailwind redefinido desde cero (`--*: initial`).
