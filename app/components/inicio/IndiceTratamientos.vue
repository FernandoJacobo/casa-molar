<script setup lang="ts">
import { tratamientos } from '~/data/tratamientos'
import { pesos } from '~/utils/formato'

const activo = ref(tratamientos[0]!.slug)
/** En móvil, fila abierta (la ilustración aparece dentro). */
const abierta = ref<string | null>(null)
const t = computed(() => tratamientos.find(x => x.slug === activo.value)!)

function alternar(slug: string) {
  abierta.value = abierta.value === slug ? null : slug
  activo.value = slug
}
</script>

<template>
  <section class="indice" aria-labelledby="indice-titulo">
    <div class="contenedor">
      <UiCabezaSeccion id="indice-titulo" num="14" rotulo="Índice de tratamientos" titulo="Lo que hacemos, con precio.">
        Nueve tratamientos, sin letra chiquita. El precio es "desde" y se confirma en la valoración.
      </UiCabezaSeccion>

      <div class="indice__rejilla">
        <ol class="indice__lista">
          <li
            v-for="x in tratamientos"
            :key="x.slug"
            class="fila"
            :class="{ 'is-activa': activo === x.slug, 'is-abierta': abierta === x.slug }"
            @mouseenter="activo = x.slug"
            @focusin="activo = x.slug"
          >
            <div class="fila__linea">
              <span class="fila__codigo mono">{{ x.codigo }}</span>
              <h3 class="fila__nombre">
                <NuxtLink :to="`/tratamientos/${x.slug}`">{{ x.nombre }}</NuxtLink>
              </h3>
              <p class="fila__desc">{{ x.linea }}</p>
              <p class="fila__precio mono"><span class="fila__desde">desde</span> {{ pesos(x.desde) }}</p>
              <button
                type="button"
                class="fila__abrir"
                :aria-expanded="abierta === x.slug"
                :aria-controls="`fila-${x.slug}`"
                :aria-label="`${abierta === x.slug ? 'Cerrar' : 'Ver'} detalle de ${x.nombre}`"
                @click="alternar(x.slug)"
              >
                <span aria-hidden="true">{{ abierta === x.slug ? '−' : '+' }}</span>
              </button>
            </div>
            <div :id="`fila-${x.slug}`" class="fila__detalle" :hidden="abierta !== x.slug">
              <SvgIlustracionTratamiento :slug="x.slug" class="fila__ilus" />
              <div>
                <p>{{ x.linea }}</p>
                <p class="etiqueta fila__dur">{{ x.duracion }} · {{ x.unidad }}</p>
                <NuxtLink :to="`/tratamientos/${x.slug}`" class="enlace">Ver {{ x.nombre.toLowerCase() }}</NuxtLink>
              </div>
            </div>
          </li>
        </ol>

        <aside class="indice__lamina" aria-hidden="true">
          <div class="indice__pegajosa">
            <p class="indice__codigo-grande mono">{{ t.codigo }}</p>
            <div class="indice__ilus">
              <SvgIlustracionTratamiento :key="t.slug" :slug="t.slug" />
            </div>
            <p class="etiqueta indice__pie">{{ t.nombre }} · {{ t.duracion }}</p>
          </div>
        </aside>
      </div>

      <NuxtLink to="/tratamientos" class="boton boton--claro indice__todos">Ver todos los tratamientos</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.indice {
  padding-block: clamp(4rem, 9vw, 8rem);
}

.indice__rejilla {
  display: grid;
  margin-top: clamp(2rem, 5vw, 3.5rem);
}

.indice__lista {
  border-top: 1.5px solid var(--color-tinta);
}

.fila {
  border-bottom: 1px solid var(--color-tinta);
}

.fila__linea {
  display: grid;
  grid-template-columns: 3.2rem minmax(0, 1fr) auto 2.75rem;
  align-items: center;
  gap: 0.25rem 0.75rem;
  min-height: 4.2rem;
  padding-block: 0.6rem;
}

.fila__codigo {
  font-size: 0.78rem;
  color: var(--color-coral-oscuro);
}

.fila__nombre {
  font-size: clamp(1.35rem, 2.6vw, 2.1rem);
  line-height: 1.05;
  hyphens: auto;
  overflow-wrap: break-word;
}

.fila__nombre a {
  text-decoration: none;
}

.fila__nombre a:hover {
  text-decoration: underline;
  text-decoration-color: var(--color-coral);
  text-decoration-thickness: 2px;
  text-underline-offset: 0.15em;
}

.fila__desc {
  display: none;
}

.fila__precio {
  font-size: 0.88rem;
  white-space: nowrap;
  text-align: right;
}

.fila__desde {
  display: block;
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-tinta-suave);
}

.fila__abrir {
  width: 2.75rem;
  height: 2.75rem;
  border: 1.5px solid var(--color-tinta);
  border-radius: 50%;
  background: var(--color-marfil);
  font-size: 1.3rem;
  line-height: 1;
}

.fila__detalle {
  display: grid;
  grid-template-columns: 7.5rem 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.25rem 0 1.25rem 3.95rem;
}

.fila__detalle[hidden] {
  display: none;
}

.fila__ilus {
  background: var(--color-hueso);
}

.fila__dur {
  margin: 0.5rem 0 0.6rem;
  color: var(--color-tinta-suave);
  text-transform: none;
  letter-spacing: 0.02em;
}

.indice__lamina {
  display: none;
}

.indice__todos {
  margin-top: 2rem;
}

@media (min-width: 64rem) {
  .indice__rejilla {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: clamp(2rem, 4vw, 4rem);
  }

  .fila__linea {
    grid-template-columns: 4rem minmax(0, 1.1fr) minmax(0, 1fr) 6.5rem;
    min-height: 5.6rem;
    gap: 1.25rem;
    transition: background-color 0.2s, padding 0.25s var(--ease-suave);
  }

  .fila__desc {
    display: block;
    font-size: 0.95rem;
    color: var(--color-tinta-suave);
  }

  .fila__abrir,
  .fila__detalle {
    display: none !important;
  }

  .fila.is-activa .fila__linea {
    background: var(--color-hueso);
    padding-left: 0.75rem;
  }

  .indice__lamina {
    display: block;
  }

  .indice__pegajosa {
    position: sticky;
    top: 2rem;
  }

  .indice__codigo-grande {
    font-size: clamp(4rem, 8vw, 7.5rem);
    font-weight: 700;
    line-height: 0.9;
    letter-spacing: -0.05em;
    color: var(--color-coral);
  }

  .indice__ilus {
    margin-top: -1.5rem;
    background: var(--color-hueso);
    border: 1.5px solid var(--color-tinta);
    border-radius: 50% 50% 4px 4px / 32% 32% 4px 4px;
    padding: 1rem;
  }

  .indice__pie {
    margin-top: 0.75rem;
    color: var(--color-tinta-suave);
  }
}
</style>
