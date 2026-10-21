<script setup lang="ts">
useSeoPagina('Cronómetro de cepillado', 'Dos minutos, cuatro cuadrantes de 30 segundos. Un cronómetro que te dice qué zona cepillar, con modo para peques. Funciona sin internet.')

const TOTAL = 120
const POR_CUADRANTE = 30

/** Orden FDI: superior derecho, superior izquierdo, inferior izquierdo, inferior derecho. */
const CUADRANTES = [
  { n: 1, zona: 'Arriba a la derecha', tip: 'Cepillo a 45° hacia la encía, movimientos cortos.', peques: '¡Arriba, del lado de tu mano de comer!' },
  { n: 2, zona: 'Arriba a la izquierda', tip: 'No olvides la cara de atrás de las muelas.', peques: '¡Ahora al otro lado de arriba!' },
  { n: 3, zona: 'Abajo a la izquierda', tip: 'Por dentro, el cepillo en vertical en los de enfrente.', peques: '¡Abajo! Barre como escobita.' },
  { n: 4, zona: 'Abajo a la derecha', tip: 'Termina con la lengua: de atrás hacia adelante.', peques: '¡Último lado! Ya casi ganas.' },
]

const peques = useLocalStorage('casa-molar:peques', false, { initOnMounted: true })
const transcurrido = ref(0)
const corriendo = ref(false)
const terminado = computed(() => transcurrido.value >= TOTAL)
const restante = computed(() => Math.max(0, TOTAL - transcurrido.value))
const indice = computed(() => Math.min(3, Math.floor(transcurrido.value / POR_CUADRANTE)))
const actual = computed(() => CUADRANTES[indice.value]!)
const enCuadrante = computed(() => POR_CUADRANTE - (transcurrido.value - indice.value * POR_CUADRANTE))
const iniciado = computed(() => transcurrido.value > 0)

const reloj = computed(() => {
  const s = Math.ceil(restante.value)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
})

/* Anillo de progreso: 4 arcos, uno por cuadrante. */
const R = 46
const C = 2 * Math.PI * R
const HUECO = 2.2
const arcos = computed(() => CUADRANTES.map((q, i) => {
  const avance = Math.min(1, Math.max(0, (transcurrido.value - i * POR_CUADRANTE) / POR_CUADRANTE))
  const largo = C / 4 - HUECO
  return { n: q.n, largo, hecho: largo * avance, offset: -(i * C) / 4 - HUECO / 2 }
}))

let marca = 0
let raf = 0
function paso(t: number) {
  if (!corriendo.value) return
  const antes = indice.value
  transcurrido.value = Math.min(TOTAL, transcurrido.value + (t - marca) / 1000)
  marca = t
  if (indice.value !== antes) vibrar([120])
  if (terminado.value) {
    corriendo.value = false
    vibrar([180, 90, 180, 90, 320])
    return
  }
  raf = requestAnimationFrame(paso)
}

function vibrar(patron: number[]) {
  if ('vibrate' in navigator) navigator.vibrate(patron)
}

function alternar() {
  if (terminado.value) transcurrido.value = 0
  corriendo.value = !corriendo.value
  if (corriendo.value) {
    if (!iniciado.value && matchMedia('(max-width: 63.99rem)').matches) {
      document.querySelector('.cep__reloj')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    }
    marca = performance.now()
    raf = requestAnimationFrame(paso)
  }
}

function reiniciar() {
  corriendo.value = false
  cancelAnimationFrame(raf)
  transcurrido.value = 0
}

onKeyStroke(' ', (e) => {
  if ((e.target as HTMLElement)?.closest('button, input, a, select, textarea')) return
  e.preventDefault()
  alternar()
})

/* Si la pestaña se oculta, requestAnimationFrame se detiene: al volver, se descuenta el tiempo real. */
useEventListener(document, 'visibilitychange', () => {
  if (document.visibilityState === 'visible' && corriendo.value) marca = performance.now()
})

onBeforeUnmount(() => cancelAnimationFrame(raf))

/* Disponible sin conexión: el service worker guarda esta página y sus archivos al visitarla. */
onMounted(() => {
  if ('serviceWorker' in navigator && !import.meta.dev) navigator.serviceWorker.register('/sw.js').catch(() => {})
})

/** Anuncia solo al cambiar de cuadrante o al terminar, no cada segundo. */
const anuncioVivo = ref('')
watch([indice, terminado, corriendo], () => {
  if (corriendo.value || terminado.value) anuncioVivo.value = terminado.value ? 'Terminaste. Dos minutos completos.' : `${actual.value.zona}: 30 segundos.`
})
</script>

<template>
  <div class="cep" :class="{ 'cep--peques': peques, 'is-corriendo': corriendo }">
    <div class="contenedor cep__rejilla">
      <header class="cep__cabeza">
        <UiCabezaSeccion as="h1" num="41" rotulo="Cronómetro" :titulo="peques ? '¡A cepillar!' : 'Dos minutos, cuatro zonas.'">
          {{ peques ? 'Treinta segundos en cada lado de la boca. Cuando el teléfono vibre, cambias.' : 'Treinta segundos por cuadrante. Cuando cambia la zona, el teléfono vibra (si lo permite).' }}
        </UiCabezaSeccion>

        <label class="cep__modo">
          <input v-model="peques" type="checkbox" role="switch">
          <span class="cep__interruptor" aria-hidden="true" />
          <span>Modo peques</span>
        </label>
      </header>

      <section class="cep__reloj" aria-label="Cronómetro">
        <div class="cep__dial">
          <svg class="cep__anillo" viewBox="0 0 100 100" aria-hidden="true">
            <g transform="rotate(-90 50 50)">
              <circle
                v-for="a in arcos"
                :key="`f${a.n}`"
                cx="50" cy="50" :r="R"
                class="cep__arco-fondo"
                :stroke-dasharray="`${a.largo} ${C - a.largo}`"
                :stroke-dashoffset="a.offset"
              />
              <circle
                v-for="a in arcos"
                :key="`h${a.n}`"
                cx="50" cy="50" :r="R"
                class="cep__arco"
                :stroke-dasharray="`${a.hecho} ${C - a.hecho}`"
                :stroke-dashoffset="a.offset"
              />
            </g>
          </svg>
          <div class="cep__arcada">
            <SvgArcadaSvg :cuadrante="iniciado && !terminado ? actual.n : null" :titulo="iniciado && !terminado ? `Zona a cepillar: ${actual.zona}` : 'Arcadas superior e inferior'" />
            <span class="cep__lado cep__lado--der mono" aria-hidden="true">der.</span>
            <span class="cep__lado cep__lado--izq mono" aria-hidden="true">izq.</span>
          </div>
        </div>

        <div class="cep__lectura">
          <p class="cep__tiempo mono" :aria-label="`Quedan ${reloj}`">{{ reloj }}</p>
          <p class="cep__zona">
            <template v-if="terminado">{{ peques ? '¡Ganaste! Dientes limpios.' : 'Listo. Escupe, no enjuagues.' }}</template>
            <template v-else-if="iniciado">
              <span class="etiqueta cep__q">Cuadrante {{ actual.n }} · {{ Math.ceil(enCuadrante) }} s</span>
              {{ peques ? actual.peques : actual.zona }}
            </template>
            <template v-else>{{ peques ? 'Ponle pasta del tamaño de un chícharo.' : 'Pasta del tamaño de un chícharo, y a empezar.' }}</template>
          </p>
          <p v-if="iniciado && !terminado && !peques" class="cep__tip">{{ actual.tip }}</p>
          <p v-if="terminado && !peques" class="cep__tip">Escupir sin enjuagar deja el flúor trabajando más tiempo.</p>

          <div class="cep__controles">
            <button type="button" class="boton boton--coral cep__principal" @click="alternar">
              {{ corriendo ? 'Pausar' : terminado ? 'Otra vez' : iniciado ? 'Seguir' : 'Empezar' }}
            </button>
            <button v-if="iniciado" type="button" class="boton boton--claro" @click="reiniciar">Reiniciar</button>
          </div>
          <p class="cep__atajo etiqueta">Barra espaciadora: empezar o pausar</p>
        </div>
        <p class="sr-only" aria-live="assertive">{{ anuncioVivo }}</p>
      </section>

      <aside class="cep__notas">
        <h2 class="etiqueta">Para que sirva de algo</h2>
        <ol>
          <li><b>Dos veces al día</b>, la de la noche es la que no se perdona.</li>
          <li><b>Cepillo suave.</b> Duro no limpia más, desgasta la encía.</li>
          <li><b>Hilo dental</b> una vez al día: el cepillo no entra entre dientes.</li>
          <li><b>Cambia el cepillo</b> cada 3 meses o cuando las cerdas se abran.</li>
        </ol>
        <p class="cep__offline">Una vez que cargó, esta página funciona sin internet.</p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.cep {
  padding-block: clamp(2rem, 5vw, 4rem) clamp(3rem, 7vw, 6rem);
}

.cep__rejilla {
  display: grid;
  gap: 2.5rem;
}

.cep__modo {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 1.5rem;
  min-height: 2.75rem;
  font-weight: 700;
  cursor: pointer;
}

.cep__modo input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.cep__interruptor {
  position: relative;
  width: 3.2rem;
  height: 1.7rem;
  border: 1.5px solid var(--color-tinta);
  border-radius: 2px;
  background: var(--color-marfil);
}

.cep__interruptor::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.2rem;
  height: calc(100% - 4px);
  background: var(--color-tinta);
  transition: translate 0.18s;
}

.cep__modo input:checked + .cep__interruptor {
  background: var(--color-menta);
}

.cep__modo input:checked + .cep__interruptor::after {
  translate: 1.55rem 0;
  background: var(--color-coral-oscuro);
}

.cep__modo input:focus-visible + .cep__interruptor {
  outline: 2.5px solid var(--color-coral-oscuro);
  outline-offset: 2px;
}

.cep__reloj {
  display: grid;
  gap: 1.25rem;
  scroll-margin-top: 0.75rem;
  justify-items: center;
}

.cep__dial {
  position: relative;
  width: min(100%, 19rem);
  aspect-ratio: 1;
}

.cep__anillo {
  position: absolute;
  inset: 0;
  overflow: visible;
}

.cep__arco-fondo,
.cep__arco {
  fill: none;
  stroke-width: 3.2;
}

.cep__arco-fondo {
  stroke: var(--color-arena);
}

.cep__arco {
  stroke: var(--color-coral-oscuro);
}

.cep__arcada {
  position: absolute;
  inset: 17%;
  display: grid;
  place-items: center;
}

.cep__lado {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  font-size: 0.68rem;
  text-transform: uppercase;
  color: var(--color-tinta-suave);
}

/* Vista del paciente de frente: su derecha queda a nuestra izquierda. */
.cep__lado--der {
  left: -1.6rem;
}

.cep__lado--izq {
  right: -1.6rem;
}

.cep__lectura {
  display: grid;
  justify-items: center;
  text-align: center;
  max-width: 30rem;
}

.cep__tiempo {
  font-size: clamp(4rem, 18vw, 7rem);
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
}

.cep__zona {
  margin-top: 0.8rem;
  min-height: 3.6em;
  font-family: var(--font-serif);
  font-size: clamp(1.45rem, 4vw, 1.9rem);
  line-height: 1.2;
}

.cep__q {
  display: block;
  margin-bottom: 0.3rem;
  font-family: var(--font-mono);
  color: var(--color-coral-oscuro);
}

.cep__tip {
  margin-top: 0.4rem;
  color: var(--color-tinta-suave);
}

.cep__controles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.cep__principal {
  min-width: 10rem;
  font-size: 1.1rem;
}

.cep__atajo {
  display: none;
  margin-top: 1rem;
  color: var(--color-tinta-suave);
}

.cep__notas {
  border-top: 1.5px solid var(--color-tinta);
  padding-top: 1.25rem;
}

.cep__notas h2 {
  color: var(--color-coral-oscuro);
}

.cep__notas ol {
  display: grid;
  gap: 0.6rem;
  margin-top: 0.9rem;
  padding-left: 1.3rem;
  list-style: decimal-leading-zero;
}

.cep__notas li::marker {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-tinta-suave);
}

.cep__offline {
  margin-top: 1.2rem;
  font-size: 0.88rem;
  color: var(--color-tinta-suave);
}

/* Modo peques: más grande, más color, menos texto. */
.cep--peques {
  background: var(--color-menta);
  border-bottom: 1.5px solid var(--color-tinta);
}

.cep--peques .cep__arco {
  stroke: var(--color-coral);
  stroke-width: 5;
}

.cep--peques .cep__arco-fondo {
  stroke: var(--color-marfil);
  stroke-width: 5;
}

.cep--peques :deep(.arcada__pieza.is-activa) {
  --pz-relleno: var(--color-coral);
}

.cep--peques .cep__tiempo {
  color: var(--color-tinta);
}

.cep--peques .cep__notas {
  display: none;
}

@media (hover: hover) {
  .cep__atajo {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cep__interruptor::after {
    transition: none;
  }
}

@media (min-width: 64rem) {
  .cep__rejilla {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    grid-template-areas: 'cabeza reloj' 'notas reloj';
    column-gap: clamp(3rem, 6vw, 6rem);
    align-items: start;
  }

  .cep__reloj {
    gap: 2rem;
  }

  .cep__dial {
    width: min(100%, 26rem);
  }

  .cep__cabeza { grid-area: cabeza; }
  .cep__reloj { grid-area: reloj; }
  .cep__notas { grid-area: notas; }
}
</style>
