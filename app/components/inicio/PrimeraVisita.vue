<script setup lang="ts">
/** Barra proporcional de 45 minutos: cada tramo es una pestaña con su explicación. */
import { primeraVisita } from '~/data/contenido'

const total = primeraVisita.reduce((s, t) => s + t.minutos, 0)
const activo = ref(primeraVisita[0]!.id)
const tramo = computed(() => primeraVisita.find(t => t.id === activo.value)!)
const inicioDe = (i: number) => primeraVisita.slice(0, i).reduce((s, t) => s + t.minutos, 0)

const botones = ref<HTMLButtonElement[]>([])
function alTeclear(e: KeyboardEvent, i: number) {
  const n = primeraVisita.length
  let j: number | null = null
  if (e.key === 'ArrowRight') j = (i + 1) % n
  else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n
  else if (e.key === 'Home') j = 0
  else if (e.key === 'End') j = n - 1
  if (j === null) return
  e.preventDefault()
  activo.value = primeraVisita[j]!.id
  botones.value[j]?.focus()
}
</script>

<template>
  <section class="visita" aria-labelledby="visita-titulo">
    <div class="contenedor">
      <div class="visita__cabeza">
        <UiCabezaSeccion id="visita-titulo" num="16" rotulo="Primera visita" :titulo="`Tu primera visita, en ${total} minutos.`">
          Sin sorpresas: esto es lo que pasa, minuto a minuto. Toca cada tramo.
        </UiCabezaSeccion>
      </div>

      <div class="visita__grafica">
        <div class="visita__escala mono" aria-hidden="true">
          <span v-for="m in [0, 15, 30, 45]" :key="m" :style="{ left: `${(m / total) * 100}%` }">{{ m }}′</span>
        </div>
        <div class="visita__barra" role="tablist" aria-label="Etapas de la primera visita">
          <button
            v-for="(t, i) in primeraVisita"
            :id="`tab-${t.id}`"
            :key="t.id"
            ref="botones"
            type="button"
            role="tab"
            class="visita__tramo"
            :class="{ 'is-activo': activo === t.id }"
            :style="{ flexGrow: t.minutos }"
            :aria-selected="activo === t.id"
            :aria-controls="`panel-${t.id}`"
            :tabindex="activo === t.id ? 0 : -1"
            @click="activo = t.id"
            @keydown="alTeclear($event, i)"
          >
            <span class="visita__min mono">{{ t.minutos }} min</span>
            <span class="visita__nombre">{{ t.titulo }}</span>
            <span class="visita__rango mono" aria-hidden="true">{{ inicioDe(i) }}–{{ inicioDe(i) + t.minutos }}′</span>
          </button>
        </div>

        <div :id="`panel-${tramo.id}`" class="visita__ficha" role="tabpanel" :aria-labelledby="`tab-${tramo.id}`">
          <div>
            <h3 class="etiqueta visita__sub">Qué pasa</h3>
            <p class="visita__pasa">{{ tramo.pasa }}</p>
          </div>
          <div>
            <h3 class="etiqueta visita__sub">Qué traer</h3>
            <p>{{ tramo.traer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.visita {
  padding-block: clamp(6rem, 14vw, 12rem) clamp(4rem, 9vw, 8rem);
}

.visita__grafica {
  margin-top: clamp(2.5rem, 6vw, 4.5rem);
}

.visita__escala {
  position: relative;
  height: 1.6rem;
  font-size: 0.72rem;
  color: var(--color-tinta-suave);
}

.visita__escala span {
  position: absolute;
  translate: -50% 0;
}

.visita__escala span:first-child {
  translate: 0 0;
}

.visita__escala span:last-child {
  translate: -100% 0;
}

.visita__barra {
  display: flex;
  overflow: hidden;
  border: 1px solid var(--color-linea);
  border-bottom-width: 0;
  border-radius: 16px 16px 0 0;
}

.visita__tramo {
  flex-basis: 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.4rem;
  min-height: 8.5rem;
  padding: 0.75rem clamp(0.45rem, 2vw, 0.75rem);
  border: 0;
  border-right: 1px solid var(--color-linea);
  background: var(--color-blanco);
  text-align: left;
  transition: background-color 0.2s;
}

.visita__tramo:last-child {
  border-right: 0;
}

.visita__tramo:hover {
  background-color: var(--color-niebla);
}

.visita__tramo.is-activo {
  background: var(--color-petroleo);
  color: var(--color-blanco);
}

.visita__tramo.is-activo .visita__rango {
  color: var(--color-agua);
}

.visita__min {
  font-size: clamp(1.3rem, 3vw, 2.4rem);
  font-weight: 700;
  line-height: 1;
}

.visita__nombre {
  font-family: var(--font-serif);
  font-size: clamp(0.95rem, 1.8vw, 1.4rem);
  line-height: 1.05;
  hyphens: auto;
  overflow-wrap: anywhere;
  max-width: 100%;
}

.visita__rango {
  font-size: 0.7rem;
  color: var(--color-tinta-suave);
}

.visita__ficha {
  display: grid;
  gap: 1.25rem;
  padding: 1.4rem 1.25rem;
  border: 1px solid var(--color-linea);
  border-radius: 0 0 16px 16px;
  background: var(--color-niebla);
}

.visita__sub {
  color: var(--color-petroleo-oscuro);
  margin-bottom: 0.4rem;
}

.visita__pasa {
  font-size: 1.12rem;
}

@media (max-width: 39.99rem) {
  .visita__tramo {
    min-height: 7rem;
    padding: 0.55rem 0.4rem;
  }

  .visita__min {
    font-size: 1.05rem;
  }

  .visita__nombre {
    font-family: var(--font-sans);
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.2;
    overflow-wrap: normal;
  }

  .visita__rango {
    display: none;
  }
}

@media (min-width: 48rem) {
  .visita__ficha {
    grid-template-columns: 1.4fr 1fr;
    gap: 2.5rem;
    padding: 1.8rem 2rem;
  }
}
</style>
