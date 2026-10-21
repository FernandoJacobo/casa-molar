<script setup lang="ts">
import { preciosExtra } from '~/data/contenido'
import { tratamientos } from '~/data/tratamientos'
import { pesos } from '~/utils/formato'

interface Renglon { nombre: string; desde: number; nota?: string; to?: string }

const ORDEN = ['Prevención', 'Restauración', 'Estética', 'Ortodoncia', 'Cirugía e implantes', 'Niñas y niños']
const grupos = computed(() =>
  ORDEN.map(cat => ({
    cat,
    renglones: [
      ...tratamientos.filter(t => t.categoria === cat).map<Renglon>(t => ({ nombre: t.nombre, desde: t.desde, nota: t.unidad, to: `/tratamientos/${t.slug}` })),
      ...preciosExtra.filter(p => p.categoria === cat).map<Renglon>(p => ({ nombre: p.nombre, desde: p.desde, nota: p.nota })),
    ],
  })).filter(g => g.renglones.length),
)
</script>

<template>
  <div class="lista">
    <section v-for="g in grupos" :key="g.cat" class="lista__grupo" :aria-labelledby="`lp-${g.cat}`">
      <h2 :id="`lp-${g.cat}`" class="etiqueta lista__cat">{{ g.cat }}</h2>
      <ul>
        <li v-for="r in g.renglones" :key="r.nombre" class="renglon">
          <span class="renglon__nombre">
            <NuxtLink v-if="r.to" :to="r.to">{{ r.nombre }}</NuxtLink>
            <template v-else>{{ r.nombre }}</template>
            <small v-if="r.nota">{{ r.nota }}</small>
          </span>
          <span class="renglon__guia" aria-hidden="true" />
          <span class="renglon__precio mono"><span class="sr-only">desde</span>{{ pesos(r.desde) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.lista {
  display: grid;
  gap: 2rem;
}

.lista__cat {
  color: var(--color-petroleo-oscuro);
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--color-linea);
  margin-bottom: 0.3rem;
}

.renglon {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding-block: 0.45rem;
}

.renglon__nombre {
  font-size: 1.05rem;
}

.renglon__nombre a {
  text-decoration: none;
}

.renglon__nombre a:hover {
  text-decoration: underline;
  text-decoration-color: var(--color-petroleo);
}

.renglon__nombre small {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-tinta-suave);
  letter-spacing: 0.04em;
}

/* Puntos guía. */
.renglon__guia {
  flex: 1;
  min-width: 1.5rem;
  border-bottom: 2px dotted var(--color-linea-fuerte);
  translate: 0 -0.3em;
  align-self: flex-start;
  margin-top: 1em;
}

.renglon__precio {
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
}

@media (min-width: 64rem) {
  .lista {
    grid-template-columns: 1fr 1fr;
    column-gap: 4rem;
  }
}
</style>
