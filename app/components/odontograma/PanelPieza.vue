<script setup lang="ts">
import { piezaPorFdi } from '~/data/piezas'
import { tratamientoPorSlug } from '~/data/tratamientos'

const props = defineProps<{ fdi: number | null }>()
const emit = defineEmits<{ cerrar: [] }>()

const pieza = computed(() => (props.fdi ? piezaPorFdi(props.fdi) : undefined))
const relacionados = computed(() => (pieza.value?.tratamientos ?? []).map(s => tratamientoPorSlug(s)!).filter(Boolean))
</script>

<template>
  <div class="panel" aria-live="polite">
    <template v-if="pieza">
      <div class="panel__cabeza">
        <p class="panel__fdi" aria-hidden="true">{{ pieza.fdi }}</p>
        <div>
          <p class="etiqueta panel__codigo">Pieza {{ pieza.fdi }} · cuadrante {{ pieza.cuadrante }}</p>
          <h3 class="h3 panel__nombre">{{ pieza.nombre }}</h3>
        </div>
        <button type="button" class="panel__cerrar etiqueta" @click="emit('cerrar')">Cerrar</button>
      </div>

      <p class="panel__funcion">{{ pieza.funcion }}</p>

      <h4 class="etiqueta panel__sub">Problemas más frecuentes</h4>
      <ul class="panel__lista">
        <li v-for="p in pieza.problemas" :key="p">{{ p }}</li>
      </ul>

      <h4 class="etiqueta panel__sub">Tratamientos relacionados</h4>
      <ul class="panel__trat">
        <li v-for="t in relacionados" :key="t.slug">
          <NuxtLink :to="`/tratamientos/${t.slug}`" class="panel__enlace">
            <span class="mono">{{ t.codigo }}</span> {{ t.nombre }}
          </NuxtLink>
        </li>
      </ul>

      <p class="panel__dato"><span class="etiqueta">Dato</span> {{ pieza.dato }}</p>

      <NuxtLink :to="{ path: '/cita', query: { pieza: pieza.fdi } }" class="boton boton--coral panel__cta">
        Revisar esta pieza
      </NuxtLink>
      <p class="panel__aviso">Información orientativa. Lo que pasa en tu boca solo se sabe en una valoración.</p>
    </template>

    <div v-else class="panel__vacio">
      <p class="panel__fdi panel__fdi--vacio" aria-hidden="true">00</p>
      <p class="h3">Toca una pieza.</p>
      <p>Te decimos cómo se llama, para qué sirve, qué le pasa más seguido y qué se le puede hacer.</p>
      <p class="etiqueta panel__teclas">Con teclado: Tab para entrar · flechas para moverte · Enter para abrir</p>
    </div>
  </div>
</template>

<style scoped>
.panel {
  position: relative;
}

.panel__cabeza {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: end;
  gap: 0.9rem;
  padding-bottom: 0.9rem;
  border-bottom: 1.5px solid var(--color-tinta);
}

.panel__fdi {
  font-family: var(--font-serif);
  font-size: clamp(4.5rem, 9vw, 7rem);
  line-height: 0.78;
  color: var(--color-coral-titular);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
}

.panel__fdi--vacio {
  color: var(--color-tinta-suave);
}

.panel__codigo {
  color: var(--color-tinta-suave);
}

.panel__nombre {
  margin-top: 0.3rem;
}

.panel__cerrar {
  align-self: start;
  min-height: 2.75rem;
  padding: 0 0.6rem;
  border: 0;
  background: none;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.panel__funcion {
  margin-top: 1rem;
  font-size: 1.08rem;
}

.panel__sub {
  margin: 1.2rem 0 0.45rem;
  color: var(--color-coral-oscuro);
}

.panel__lista li {
  position: relative;
  padding-left: 1.1rem;
  margin-bottom: 0.3rem;
}

.panel__lista li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.62em;
  width: 0.5rem;
  border-top: 1.5px solid var(--color-tinta);
}

.panel__trat {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.panel__enlace {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.75rem;
  padding: 0.3rem 0.7rem;
  border: 1.5px solid var(--color-tinta);
  border-radius: 1px 1px 12px 12px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  background: var(--color-marfil);
}

.panel__enlace:hover {
  background: var(--color-menta);
}

.panel__enlace .mono {
  font-size: 0.72rem;
  color: var(--color-coral-oscuro);
}

.panel__dato {
  margin-top: 1.2rem;
  padding: 0.8rem 0.9rem;
  background: var(--color-hueso);
  font-size: 0.95rem;
}

.panel__dato .etiqueta {
  margin-right: 0.4rem;
  color: var(--color-coral-oscuro);
}

.panel__cta {
  margin-top: 1.3rem;
}

.panel__aviso {
  margin-top: 0.8rem;
  font-size: var(--text-chico);
  color: var(--color-tinta-suave);
}

.panel__vacio {
  display: grid;
  gap: 0.8rem;
  max-width: 30ch;
}

.panel__teclas {
  color: var(--color-tinta-suave);
  text-transform: none;
  letter-spacing: 0.02em;
}
</style>
