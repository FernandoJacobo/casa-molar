<script setup lang="ts">
/**
 * Escritorio: la pregunta activa en grande a la izquierda y la lista a la derecha.
 * Móvil: acordeón (la respuesta aparece debajo de cada pregunta).
 */
import { preguntas } from '~/data/contenido'

const activa = ref(0)
const abierta = ref<number | null>(0)
const p = computed(() => preguntas[activa.value]!)

function elegir(i: number) {
  activa.value = i
  abierta.value = abierta.value === i ? null : i
}
</script>

<template>
  <section class="faq" aria-labelledby="faq-titulo">
    <div class="contenedor">
      <p class="seccion-num"><b>§ 22</b><span>Preguntas</span></p>
      <h2 id="faq-titulo" class="h2 faq__titulo">Preguntas que sí nos hacen.</h2>

      <div class="faq__rejilla">
        <div class="faq__grande" aria-live="polite">
          <p class="faq__pregunta">{{ p.pregunta }}</p>
          <p class="faq__respuesta">{{ p.respuesta }}</p>
          <NuxtLink v-if="p.enlace" :to="p.enlace.to" class="enlace">{{ p.enlace.texto }}</NuxtLink>
        </div>

        <ul class="faq__lista">
          <li v-for="(q, i) in preguntas" :key="q.pregunta" class="faq__item" :class="{ 'is-activa': activa === i }">
            <button
              type="button"
              class="faq__boton"
              :aria-expanded="abierta === i"
              :aria-controls="`faq-${i}`"
              @click="elegir(i)"
              @mouseenter="activa = i"
            >
              <span class="faq__num mono" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
              <span>{{ q.corta }}</span>
            </button>
            <div :id="`faq-${i}`" class="faq__inline" :hidden="abierta !== i">
              <p>{{ q.respuesta }}</p>
              <NuxtLink v-if="q.enlace" :to="q.enlace.to" class="enlace">{{ q.enlace.texto }}</NuxtLink>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  padding-block: clamp(4rem, 9vw, 8rem);
}

.faq__titulo {
  margin-top: 0.8rem;
}

.faq__rejilla {
  margin-top: clamp(2rem, 5vw, 3.5rem);
}

.faq__grande {
  display: none;
}

.faq__lista {
  border-top: 1.5px solid var(--color-tinta);
}

.faq__item {
  border-bottom: 1px solid var(--color-tinta);
}

.faq__boton {
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
  width: 100%;
  min-height: 3.75rem;
  padding: 0.8rem 0;
  border: 0;
  background: none;
  text-align: left;
  font-family: var(--font-serif);
  font-size: clamp(1.25rem, 2.2vw, 1.6rem);
  line-height: 1.15;
}

.faq__num {
  font-size: 0.75rem;
  color: var(--color-coral-oscuro);
}

.faq__inline {
  padding: 0 0 1.25rem 2.05rem;
  display: grid;
  gap: 0.6rem;
  justify-items: start;
}

.faq__inline[hidden] {
  display: none;
}

@media (min-width: 64rem) {
  .faq__rejilla {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: clamp(3rem, 6vw, 6rem);
    align-items: start;
  }

  .faq__grande {
    display: grid;
    gap: 1.25rem;
    justify-items: start;
    min-height: 24rem;
  }

  .faq__pregunta {
    font-family: var(--font-serif);
    font-size: clamp(3rem, 6vw, 5.4rem);
    line-height: 0.95;
    letter-spacing: -0.03em;
    text-wrap: balance;
  }

  .faq__respuesta {
    font-size: 1.15rem;
    max-width: 44ch;
  }

  .faq__inline,
  .faq__inline[hidden] {
    display: none;
  }

  .faq__boton {
    font-size: 1.3rem;
  }

  .faq__item.is-activa .faq__boton {
    color: var(--color-coral-oscuro);
  }
}
</style>
