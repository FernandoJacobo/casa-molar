# DISENO.md — Casa Molar · Odontología (demo)

Contrato de dirección de arte. Si algo en la UI contradice este documento, gana el documento (o se actualiza aquí con la razón).

> **Versión 2.** La primera dirección ("papelería de clínica": papel crema, coral, sombras duras, etiquetas mono, objetos girados, trazo a lápiz) se parecía demasiado al demo del taller mecánico. Se reemplazó por una dirección de clínica profesional: blanco, petróleo, líneas finas y tipografía editorial sobria. Los contenidos y las herramientas no cambiaron.

## 1. Concepto: "El odontograma y la guía de tonos", en limpio

Se mantienen los objetos de trabajo del consultorio como herramientas, no como decoración:

| Objeto real | Cómo vive en el sitio |
|---|---|
| **Odontograma** (32 piezas, numeración FDI) | Ilustración del hero, herramienta interactiva central, selector de piezas del plan y mapa del cronómetro. |
| **Guía de tonos** (B1…C4) | Simulador de blanqueamiento. |
| **Placa radiográfica** | La única sección oscura, para hablar de tecnología. |
| **Tarjeta de cita** | Tarjeta blanca con cabecera agua y folio: CTA, confirmación y detalle de tratamiento. |

Tono: tranquilo, preciso, humano. Consultorio bien cuidado, sin frialdad de hospital.

## 2. Tokens (un solo tema, sin modo oscuro)

| Token | Valor | Uso |
|---|---|---|
| `--color-blanco` | `#FFFFFF` | fondo principal, superficies |
| `--color-niebla` | `#F2F7F7` | secciones alternas, paneles de ilustración |
| `--color-agua` | `#E2EFEF` | cabeceras de tarjeta, fondos de avatar, sellos informativos |
| `--color-linea` | `#D9E4E6` | divisores y bordes de tarjeta |
| `--color-linea-fuerte` | `#738A90` | bordes de controles de formulario (≥ 3:1 sobre blanco) |
| `--color-tinta` | `#0F2A31` | texto, fondo del pie y bloques oscuros |
| `--color-tinta-suave` | `#4A6066` | texto secundario (≥ 5.4:1 en todos los fondos claros) |
| `--color-petroleo` | `#0E6A77` | color de marca: botón principal, enlaces, selección (6.3:1 sobre blanco) |
| `--color-petroleo-oscuro` | `#0A4C56` | hover, cinta superior, texto de acento |
| `--color-celeste` | `#8FC4D0` | acento claro sobre fondos oscuros |
| `--color-menta` | `#D8EEE6` | cuadrante activo y rellenos puntuales |
| `--color-encia` / `--color-encia-oscura` | `#EBC4BD` / `#C98F86` | **solo** ilustración anatómica |
| `--color-error` | `#B42318` | validación y acciones destructivas |
| `--color-placa*` | `#0E181D`, `#8FC4D0`, `#CFE3E8` | sección radiográfica |

Radios: 8 px (controles, horas, chips), 10 px (botones y muestras de tono), 14–16 px (tarjetas), 20–24 px (paneles de ilustración). Sin píldoras salvo el interruptor del modo peques (convención de switch).

Sombra: una sola, suave (`--shadow-suave`), solo en tarjetas que flotan sobre el fondo. Sin sombras duras ni desplazadas.

Sin textura de papel, sin filtros de trazo irregular, sin elementos girados.

## 3. Tipografía

| Rol | Familia | Pesos | Notas |
|---|---|---|---|
| Titulares | **Newsreader** | 500 | serif editorial con ejes ópticos; tracking −0.015em; cursiva solo en el "32." del hero |
| Cuerpo, interfaz, cifras | **Figtree** | 400 / 600 / 700 | `tabular-nums` en precios, horas y códigos; etiquetas en mayúsculas 600 con tracking 0.09em |

No hay monoespaciada: los datos usan la sans con números tabulares.

## 4. Composición

- Hero en dos columnas: titular contenido, entrada, dos botones y una fila de datos prácticos (valoración, estado de hoy, urgencias); arcada derecha en panel niebla.
- Rótulos de sección con raya corta en petróleo, sin numeración.
- Alternancia blanco / niebla entre secciones; la placa es la única sección oscura; el pie es tinta.
- Listas con divisores finos para tratamientos y precios; equipo en rejilla alineada de 4.

## 5. Ilustración

Línea fina en `--color-petroleo-oscuro` (1.1–1.6 unidades, `non-scaling-stroke`), rellenos blancos o niebla, encía en rosa anatómico, un único acento petróleo. Sin trazo tembloroso.

## 6. Movimiento

Solo con significado: destello que recorre las piezas una vez al cargar, transición de tono en el simulador, cambios de color en hover. Todo respeta `prefers-reduced-motion`. Sin animaciones de entrada al hacer scroll.
