# Auditoría de diseño

Revisión contra [DISENO.md](DISENO.md) (versión 2) y la lista negra del brief. Capturas de QA a 360, 390, 768, 1024, 1440 y 1536 px (`npm run qa`, `node scripts/secciones.mjs`).

## 0. Rediseño (versión 2)

La primera versión se parecía al demo del taller mecánico: fondo de papel crema, acento rojo-naranja, sombras duras desplazadas, etiquetas en monoespaciada, grano de papel, objetos girados, notas manuscritas, reglas milimétricas y numeración "§". Se cambió a una dirección de clínica profesional:

| Antes | Ahora |
|---|---|
| Marfil `#F4ECDD` + coral `#E2674D` | Blanco + petróleo `#0E6A77`, niebla y agua |
| Young Serif + Hanken Grotesk + Spline Sans Mono | Newsreader + Figtree (sin mono) |
| Sombra dura `3px 4px 0` y botón que se hunde | Una sombra suave; botones de 10 px con cambio de color |
| Bordes de tinta de 1.5 px | Líneas de 1 px `#D9E4E6`; controles con `#738A90` |
| Grano de papel, filtro de trazo a lápiz | Superficies limpias y líneas nítidas |
| Tarjeta de cartón con perforación y renglones, girada | Tarjeta blanca con cabecera agua |
| Hero: titular gigante desbordado, arcada girada, nota manuscrita | Hero en dos columnas con datos prácticos y arcada en panel |
| "§ 12", códigos FDI en el menú, "T-01" gigante | Rótulo con raya petróleo; menú limpio |
| Equipo en escalera con pestañas de tono colgando | Rejilla alineada de 4 tarjetas |
| Pie con nombre gigante a sangre | Pie tinta con columnas y mapa en panel |
| Errores en coral | Token propio `--color-error` |

## 1. Sección por sección (inicio)

| Sección | Composición |
| --- | --- |
| Cinta superior | Franja petróleo oscuro con horario, estado "abierto ahora" (hora de la clínica) y urgencias. |
| Encabezado | Logo, cuatro enlaces y botón "Agendar". En móvil, "Menú". |
| Hero | Dos columnas: titular, entrada, botones primario/secundario, fila de datos; arcada superior numerada en panel niebla. |
| Odontograma | Herramienta a ancho completo con ficha de pieza; en móvil, pestañas superior/inferior. |
| Guía de tonos | 16 muestras, selector "mi tono / mi meta", sonrisa con el tono elegido y estimación de sesiones. |
| Tratamientos | Lista con código, nombre, descripción y precio "desde"; ilustración del tratamiento activo en panel fijo. |
| Antes/después | Comparador deslizable con línea blanca y asa petróleo; aviso "Ilustración, no es un caso real". |
| Primera visita | Barra de tiempo proporcional (10/15/10/10) con pestañas y ficha. |
| Tecnología | Única sección oscura: radiografía panorámica con tres anotaciones. |
| Equipo | Rejilla de 4 con avatar ilustrado, especialidad y lo que disfruta. |
| Reseñas | Burbujas de chat estáticas, cada una "(reseña ficticia)". |
| Preguntas | `<details>` nativos con enlaces. |
| CTA | Tarjeta de cita con motivo y 6 próximos días hábiles. |
| Pie | Fondo tinta: logo, lema, botón, horario, dirección, enlaces, mapa ilustrado y aviso de demo. |

## 2. Lista negra

| Prohibido | Estado |
| --- | --- |
| Inter, Poppins, Montserrat, Roboto, Open Sans… | ✅ Newsreader y Figtree. |
| Degradados | ✅ Ninguno decorativo. Solo rayado de cortes duros en días cerrados del calendario. |
| Glow, blur, glassmorphism | ✅ Ninguno. |
| Rejillas de tarjetas iguales como recurso por defecto | ✅ Tratamientos y precios en listas; el equipo sí es rejilla porque son cuatro personas equivalentes. |
| Hero centrado con estadísticas | ✅ Hero en dos columnas; los datos son prácticos (precio de valoración, horario, urgencias), no cifras de marketing. |
| Pills | ✅ Botones de 10 px; solo el interruptor es redondo. |
| Iconos de librería | ✅ Ninguno. |
| Fotos de stock | ✅ Cero fotos. |
| Carrusel de reseñas | ✅ Estáticas. |
| Fade-up al hacer scroll | ✅ Sin animaciones de entrada. |
| Modo oscuro | ✅ Un solo tema. |
| Emojis, frases vacías | ✅ Ninguno. |
| Librerías de componentes | ✅ Todo a mano. |

Nota: el brief original prohibía el "azul clínico". El petróleo `#0E6A77` es un verde azulado profundo, no el azul cian típico; se eligió a pedido explícito de que el sitio "se vea más como clínica".

## 3. Verificación tras el rediseño

- Sin scroll horizontal de 360 a 1536 px en todas las páginas.
- Lighthouse móvil (local): rendimiento 90–94, accesibilidad 100, buenas prácticas 100.
- 34 pruebas de lógica y 28 e2e en verde.
- Ajustes durante la QA del rediseño: botón del pie invisible (regla `.pie a` le quitaba el color), franja de tonos que se salía por la izquierda, marca "hoy" encima de la fila siguiente en móvil, nombres de "Primera visita" partidos a 390 px, petróleo sin contraste sobre fondos oscuros (se agregó `--color-celeste`), enlace de crédito sin subrayado.

## 4. Pendiente o mejorable

- `og.png` es una captura del hero a 1200×630; una composición dedicada quedaría mejor.
- El sprite de piezas va en línea en cada HTML; moverlo a un archivo cacheable aligeraría el inicio.
