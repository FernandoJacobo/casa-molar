<script setup lang="ts">
/**
 * Simulador de blanqueamiento: franja de muestras (tono actual y meta), sonrisa que cambia de color
 * y estimación orientativa de sesiones y precio.
 */
import { tonos, tonoPorCodigo } from '~/data/tonos'
import { tratamientoPorSlug } from '~/data/tratamientos'
import { estimarBlanqueamiento, indiceTono } from '~/utils/tonos'
import { pesos } from '~/utils/formato'

withDefaults(defineProps<{ franjaVertical?: boolean }>(), { franjaVertical: true })

const precioSesion = tratamientoPorSlug('blanqueamiento')!.desde
const actual = ref('A3')
const meta = ref('B1')
const eligiendo = ref<'actual' | 'meta'>('actual')
const mostrar = ref<'actual' | 'meta'>('meta')

const estimacion = computed(() => estimarBlanqueamiento(tonos, actual.value, meta.value, precioSesion))
const hexMostrado = computed(() => tonoPorCodigo(mostrar.value === 'actual' ? actual.value : meta.value)!.hex)
const codigoMostrado = computed(() => (mostrar.value === 'actual' ? actual.value : meta.value))

function elegir(codigo: string) {
  if (eligiendo.value === 'actual') {
    actual.value = codigo
    mostrar.value = 'actual'
    eligiendo.value = 'meta'
  }
  else {
    meta.value = codigo
    mostrar.value = 'meta'
  }
}

const rango = computed(() => {
  const a = indiceTono(tonos, actual.value)
  const m = indiceTono(tonos, meta.value)
  return [Math.min(a, m), Math.max(a, m)]
})
const enRango = (i: number) => i > rango.value[0]! && i < rango.value[1]!
</script>

<template>
  <div class="sim" :class="{ 'sim--vertical': franjaVertical }">
    <div class="sim__franja-caja">
      <div class="sim__modo" role="group" aria-label="¿Qué tono estás eligiendo?">
        <button type="button" class="sim__modo-btn" :aria-pressed="eligiendo === 'actual'" @click="eligiendo = 'actual'">
          <span class="etiqueta">Mi tono hoy</span> <b class="mono">{{ actual }}</b>
        </button>
        <button type="button" class="sim__modo-btn" :aria-pressed="eligiendo === 'meta'" @click="eligiendo = 'meta'">
          <span class="etiqueta">Mi meta</span> <b class="mono">{{ meta }}</b>
        </button>
      </div>
      <ul class="sim__franja" :aria-label="`Guía de tonos, de más claro a más oscuro. Eligiendo: ${eligiendo === 'actual' ? 'tu tono de hoy' : 'tu meta'}`">
        <li v-for="(t, i) in tonos" :key="t.codigo" class="sim__item">
          <button
            type="button"
            class="sim__muestra"
            :class="{ 'is-actual': t.codigo === actual, 'is-meta': t.codigo === meta, 'is-rango': enRango(i) }"
            :style="{ '--hex': t.hex }"
            :aria-label="`${t.codigo}${t.codigo === actual ? ' hoy' : ''}${t.codigo === meta ? ' meta' : ''}: marcar como ${eligiendo === 'actual' ? 'tono de hoy' : 'meta'}`"
            @click="elegir(t.codigo)"
          >
            <span class="sim__codigo mono">{{ t.codigo }}</span>
            <span v-if="t.codigo === actual" class="sim__marca etiqueta" aria-hidden="true">hoy</span>
            <span v-if="t.codigo === meta" class="sim__marca sim__marca--meta etiqueta" aria-hidden="true">meta</span>
          </button>
        </li>
      </ul>
    </div>

    <div class="sim__resultado">
      <div class="sim__sonrisa">
        <SvgSonrisaSvg :tono="hexMostrado" :titulo="`Sonrisa ilustrada en el tono ${codigoMostrado}`" />
      </div>
      <div class="sim__ver" role="group" aria-label="Ver la sonrisa en">
        <button type="button" :aria-pressed="mostrar === 'actual'" @click="mostrar = 'actual'">Hoy · {{ actual }}</button>
        <button type="button" :aria-pressed="mostrar === 'meta'" @click="mostrar = 'meta'">Meta · {{ meta }}</button>
      </div>

      <dl class="sim__datos" aria-live="polite">
        <div>
          <dt class="etiqueta">Posiciones</dt>
          <dd>{{ estimacion.pasos }}</dd>
        </div>
        <div>
          <dt class="etiqueta">Sesiones aprox.</dt>
          <dd>{{ estimacion.sinCambio ? '—' : estimacion.ambicioso ? '4+' : estimacion.sesiones }}</dd>
        </div>
        <div>
          <dt class="etiqueta">Desde</dt>
          <dd>{{ estimacion.sinCambio ? '—' : pesos(estimacion.precio) }}</dd>
        </div>
      </dl>
      <p class="sim__mensaje">{{ estimacion.mensaje }}</p>
      <p class="sim__aviso">
        Simulación ilustrativa en pantalla: los colores varían según tu monitor y los resultados reales, según
        cada persona. Requiere valoración. Precio ilustrativo ({{ pesos(precioSesion) }} por sesión).
      </p>
      <NuxtLink :to="{ path: '/cita', query: { motivo: 'blanqueamiento' } }" class="boton boton--primario sim__cta">Agendar valoración de blanqueamiento</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.sim {
  display: grid;
  gap: 2rem;
}

.sim__modo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 0.75rem;
}

.sim__modo-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  min-height: 3rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--color-linea);
  background: var(--color-blanco);
  text-align: left;
}

.sim__modo-btn:first-child {
  border-radius: 10px 0 0 10px;
}

.sim__modo-btn + .sim__modo-btn {
  border-left: 0;
  border-radius: 0 10px 10px 0;
}

.sim__modo-btn[aria-pressed="true"] {
  background: var(--color-petroleo);
  color: var(--color-blanco);
}

.sim__modo-btn b {
  font-size: 1.1rem;
}

.sim__franja {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.35rem;
}

.sim__muestra {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  min-height: 4.6rem;
  padding: 0 0 0.6rem;
  border: 1px solid rgb(15 42 49 / 0.12);
  border-radius: 10px;
  background: var(--hex);
  transition: translate 0.2s var(--ease-suave);
}

.sim__muestra:hover {
  translate: 0 -3px;
}

.sim__muestra.is-rango {
  box-shadow: inset 0 -3px 0 rgb(14 106 119 / 0.45);
}

.sim__muestra.is-actual,
.sim__muestra.is-meta {
  translate: 0 -6px;
  outline: 2px solid var(--color-tinta);
  outline-offset: 2px;
}

.sim__muestra.is-meta {
  outline-color: var(--color-petroleo);
}

.sim__codigo {
  font-size: 0.78rem;
  font-weight: 700;
}

.sim__marca {
  margin-top: 0.15rem;
  font-size: 0.55rem;
  font-weight: 700;
  color: var(--color-tinta);
}

.sim__marca--meta {
  color: var(--color-petroleo-oscuro);
  font-weight: 700;
}

.sim__resultado {
  position: relative;
  display: grid;
  gap: 1.1rem;
  align-content: start;
}

.sim__gigante {
  position: absolute;
  right: -0.05em;
  top: -0.25em;
  z-index: 0;
  font-family: var(--font-serif);
  font-size: clamp(7rem, 26vw, 19rem);
  line-height: 1;
  letter-spacing: -0.06em;
  color: var(--color-linea);
  opacity: 0.55;
  pointer-events: none;
}

.sim__sonrisa {
  position: relative;
  z-index: 1;
  max-width: 34rem;
  padding-top: 1.5rem;
}

.sim__ver {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0.5rem;
}

.sim__ver button {
  min-height: 2.75rem;
  padding: 0 0.9rem;
  border: 1px solid var(--color-linea);
  border-radius: 8px;
  background: var(--color-blanco);
  font-family: var(--font-mono);
  font-size: 0.82rem;
}

.sim__ver button[aria-pressed="true"] {
  background: var(--color-petroleo);
  color: var(--color-blanco);
}

.sim__datos {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: start;
  gap: 0 clamp(1.5rem, 4vw, 3rem);
  border-top: 1px solid var(--color-linea);
  padding-top: 0.9rem;
}

.sim__datos dd {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.sim__datos div:last-child dd {
  color: var(--color-petroleo-oscuro);
}

.sim__mensaje {
  font-size: 1.1rem;
  max-width: 40ch;
}

.sim__aviso {
  font-size: var(--text-chico);
  color: var(--color-tinta-suave);
  max-width: 52ch;
}

.sim__cta {
  justify-self: start;
}

@media (min-width: 64rem) {
  /* Franja vertical a sangre: las muestras en una columna de alto completo pegada al borde. */
  .sim--vertical {
    grid-template-columns: minmax(15rem, 19rem) 1fr;
    gap: clamp(2.5rem, 6vw, 6rem);
    align-items: stretch;
  }

  .sim--vertical .sim__franja-caja {
    display: flex;
    flex-direction: column;
  }

  .sim--vertical .sim__franja {
    flex: 1;
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }

  .sim--vertical .sim__muestra {
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.8rem;
    min-height: 2.6rem;
    height: 100%;
    padding: 0 0.9rem;
    border-radius: 10px;
  }

  .sim--vertical .sim__muestra:hover {
    translate: 4px 0;
  }

  .sim--vertical .sim__muestra.is-actual,
  .sim--vertical .sim__muestra.is-meta {
    translate: 6px 0;
  }

  .sim--vertical .sim__marca {
    position: static;
    margin-left: auto;
    color: var(--color-tinta);
    font-weight: 700;
  }

  .sim--vertical .sim__marca--meta {
    color: var(--color-petroleo-oscuro);
  }

  .sim--vertical .sim__resultado {
    padding-block: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sim__muestra {
    transition: none;
  }
}
</style>
