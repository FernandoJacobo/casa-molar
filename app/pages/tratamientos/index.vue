<script setup lang="ts">
import { tratamientos, type Tratamiento } from '~/data/tratamientos'
import { pesos } from '~/utils/formato'

useSeoPagina('Tratamientos', 'Nueve tratamientos con precio "desde", duración y qué esperar: limpieza, resinas, blanqueamiento, ortodoncia, implantes, carillas, endodoncia y odontopediatría.')

const categorias = computed(() => {
  const mapa = new Map<string, Tratamiento[]>()
  for (const t of tratamientos) mapa.set(t.categoria, [...(mapa.get(t.categoria) ?? []), t])
  return [...mapa.entries()]
})
</script>

<template>
  <div class="trat contenedor">
    <header class="trat__cabeza">
      <UiCabezaSeccion as="h1" num="11–48" rotulo="Expediente de tratamientos" titulo="Tratamientos.">
        Qué es, para quién, cuánto tarda y desde cuánto cuesta. Si algo no lo necesitas, te lo decimos.
      </UiCabezaSeccion>
      <p class="trat__aviso etiqueta">Precios ilustrativos · sujetos a valoración</p>
    </header>

    <section v-for="[cat, lista] in categorias" :key="cat" class="trat__grupo" :aria-labelledby="`cat-${cat}`">
      <h2 :id="`cat-${cat}`" class="trat__cat etiqueta">{{ cat }}</h2>
      <ul class="trat__lista">
        <li v-for="t in lista" :key="t.slug">
          <NuxtLink :to="`/tratamientos/${t.slug}`" class="ficha">
            <span class="ficha__ilus"><SvgIlustracionTratamiento :slug="t.slug" /></span>
            <span class="ficha__codigo mono">{{ t.codigo }}</span>
            <span class="ficha__nombre">{{ t.nombre }}</span>
            <span class="ficha__linea">{{ t.linea }}</span>
            <span class="ficha__datos mono">
              <span>{{ t.duracion }}</span>
              <span class="ficha__precio">desde {{ pesos(t.desde) }} <small>{{ t.unidad }}</small></span>
            </span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.trat {
  padding-block: clamp(2rem, 5vw, 4rem);
}

.trat__cabeza {
  display: grid;
  gap: 1.25rem;
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
}

.trat__aviso {
  color: var(--color-petroleo-oscuro);
}

.trat__grupo {
  display: grid;
  gap: 0.75rem;
  padding-block: 1.5rem;
  border-top: 1px solid var(--color-linea);
}

.trat__cat {
  color: var(--color-tinta-suave);
}

.trat__lista {
  display: grid;
}

.ficha {
  display: grid;
  grid-template-columns: 5.5rem 1fr;
  grid-template-areas:
    "ilus codigo"
    "ilus nombre"
    "ilus linea"
    "ilus datos";
  column-gap: 1rem;
  row-gap: 0.15rem;
  padding: 1rem 0;
  text-decoration: none;
  border-bottom: 1px solid var(--color-linea);
}

.trat__lista li:last-child .ficha {
  border-bottom: 0;
}

.ficha__ilus {
  grid-area: ilus;
  align-self: start;
  background: var(--color-niebla);
  border-radius: 14px;
  border: 1px solid var(--color-linea);
  transition: background-color 0.2s;
}

.ficha__codigo {
  grid-area: codigo;
  font-size: 0.75rem;
  color: var(--color-petroleo-oscuro);
}

.ficha__nombre {
  grid-area: nombre;
  font-family: var(--font-serif);
  font-size: clamp(1.5rem, 3vw, 2.4rem);
  line-height: 1.05;
}

.ficha__linea {
  grid-area: linea;
  color: var(--color-tinta-suave);
}

.ficha__datos {
  grid-area: datos;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.5rem;
  margin-top: 0.4rem;
  font-size: 0.8rem;
}

.ficha__precio small {
  color: var(--color-tinta-suave);
}

.ficha:hover .ficha__nombre {
  text-decoration: underline;
  text-decoration-color: var(--color-petroleo);
  text-decoration-thickness: 2px;
  text-underline-offset: 0.12em;
}

.ficha:hover .ficha__ilus {
  background: var(--color-menta);
}

@media (min-width: 48rem) {
  .trat__grupo {
    grid-template-columns: 12rem 1fr;
    align-items: start;
  }

  .ficha {
    grid-template-columns: 7.5rem minmax(0, 1fr) minmax(0, 15rem);
    grid-template-areas:
      "ilus codigo datos"
      "ilus nombre datos"
      "ilus linea datos";
    column-gap: 1.5rem;
  }

  .ficha__datos {
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
    align-self: center;
  }

  .ficha__precio {
    font-size: 1rem;
    font-weight: 700;
  }
}
</style>
