<script setup lang="ts">
import { site } from '~/config/site'
import { equipo } from '~/data/equipo'
import { tratamientos, tratamientoPorSlug } from '~/data/tratamientos'
import { duracionLegible, pesos } from '~/utils/formato'

const route = useRoute()
const t = computed(() => tratamientoPorSlug(String(route.params.slug)))
if (!t.value) throw createError({ statusCode: 404, statusMessage: 'Tratamiento no encontrado', fatal: true })

const tr = computed(() => t.value!)
const indice = computed(() => tratamientos.findIndex(x => x.slug === tr.value.slug))
const anterior = computed(() => tratamientos[indice.value - 1])
const siguiente = computed(() => tratamientos[indice.value + 1])
const quienes = computed(() => equipo.filter(p => p.tratamientos.includes(tr.value.slug)))
const ortodoncia = computed(() => tr.value.categoria === 'Ortodoncia')

useSeoPagina(tr.value.nombre, `${tr.value.nombre}: ${tr.value.linea} Desde ${pesos(tr.value.desde)} ${tr.value.unidad} (precio ilustrativo).`)
useJsonLd(() => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  'name': tr.value.nombre,
  'description': tr.value.enQueConsiste,
  'provider': { '@type': 'Dentist', 'name': site.nombre },
  'offers': { '@type': 'Offer', 'priceCurrency': 'MXN', 'price': tr.value.desde },
}))
</script>

<template>
  <article class="det">
    <header class="det__cabeza contenedor">
      <NuxtLink to="/tratamientos" class="etiqueta det__volver">← Tratamientos</NuxtLink>
      <div class="det__rejilla">
        <div class="det__texto">
          <p class="seccion-num"><span>{{ tr.categoria }}</span></p>
          <h1 class="det__titulo">{{ tr.nombre }}</h1>
          <p class="entrada det__linea">{{ tr.linea }}</p>
          <dl class="det__datos">
            <div><dt class="etiqueta">Desde</dt><dd>{{ pesos(tr.desde) }} <small>{{ tr.unidad }}</small></dd></div>
            <div><dt class="etiqueta">Duración</dt><dd class="det__dato-chico">{{ tr.duracion }}</dd></div>
            <div><dt class="etiqueta">Primera cita</dt><dd class="det__dato-chico">{{ duracionLegible(tr.minutosCita) }}</dd></div>
          </dl>
          <div class="det__acciones">
            <NuxtLink :to="{ path: '/cita', query: { motivo: tr.slug } }" class="boton boton--primario">Agendar {{ tr.nombre.toLowerCase() }}</NuxtLink>
            <NuxtLink :to="{ path: '/precios', query: { agregar: tr.slug }, hash: '#plan' }" class="enlace">Agregar a mi plan</NuxtLink>
          </div>
        </div>
        <div class="det__ilus">
          <SvgIlustracionTratamiento :slug="tr.slug" :titulo="`Ilustración: ${tr.nombre}`" />
        </div>
      </div>
    </header>

    <div class="contenedor det__cuerpo">
      <section class="det__bloque" aria-labelledby="consiste">
        <h2 id="consiste" class="h3">En qué consiste</h2>
        <p class="det__parrafo">{{ tr.enQueConsiste }}</p>
      </section>

      <section class="det__bloque" aria-labelledby="para-quien">
        <h2 id="para-quien" class="h3">Para quién es</h2>
        <ul class="det__lista">
          <li v-for="p in tr.paraQuien" :key="p">{{ p }}</li>
        </ul>
      </section>

      <section class="det__bloque det__bloque--ancho" aria-labelledby="proceso">
        <h2 id="proceso" class="h3">El proceso, por etapas</h2>
        <ol class="etapas">
          <li v-for="(e, i) in tr.etapas" :key="e.titulo" class="etapa">
            <span class="etapa__n mono">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="etapa__titulo">{{ e.titulo }}</h3>
            <p>{{ e.texto }}</p>
          </li>
        </ol>
      </section>

      <section v-if="ortodoncia" class="det__bloque det__bloque--ancho" aria-labelledby="revisiones">
        <h2 id="revisiones" class="h3">Así se ve la mensualidad de revisiones</h2>
        <TratamientosLineaRevisiones :meses="tr.slug === 'brackets' ? 18 : 12" :mensualidad="tr.slug === 'brackets' ? 800 : 2600" :enganche="tr.slug === 'brackets' ? 3600 : 6800" />
      </section>

      <section v-if="tr.slug === 'blanqueamiento'" class="det__bloque det__bloque--ancho" aria-labelledby="simulador">
        <h2 id="simulador" class="h3">Simula tu tono</h2>
        <div class="det__sim">
          <TonosSimuladorTonos :franja-vertical="false" />
        </div>
      </section>

      <section class="det__bloque" aria-labelledby="cuidados">
        <h2 id="cuidados" class="h3">Después: cuidados</h2>
        <ul class="det__lista">
          <li v-for="c in tr.cuidados" :key="c">{{ c }}</li>
        </ul>
      </section>

      <section class="det__bloque" aria-labelledby="quien">
        <h2 id="quien" class="h3">Quién te atiende</h2>
        <ul class="det__quienes">
          <li v-for="p in quienes" :key="p.id">
            <SvgAvatarSvg :avatar="p.avatar" class="det__avatar" />
            <span><strong>{{ p.nombre }}</strong><br><span class="etiqueta">{{ p.especialidad }}</span></span>
          </li>
        </ul>
      </section>

      <section class="det__bloque det__bloque--ancho" aria-labelledby="faq-t">
        <h2 id="faq-t" class="h3">Preguntas</h2>
        <div class="det__faq">
          <details v-for="q in tr.preguntas" :key="q.pregunta" class="det__pregunta">
            <summary>{{ q.pregunta }}</summary>
            <p>{{ q.respuesta }}</p>
          </details>
        </div>
      </section>

      <aside class="det__cierre det__bloque--ancho">
        <UiTarjetaCita etiqueta="Tarjeta de cita" :folio="tr.codigo">
          <p class="det__cierre-titulo">{{ tr.nombre }}, desde {{ pesos(tr.desde) }}.</p>
          <p class="det__cierre-texto">El precio final se confirma en la valoración, por escrito y antes de empezar.</p>
          <NuxtLink :to="{ path: '/cita', query: { motivo: tr.slug } }" class="boton boton--primario">Agendar</NuxtLink>
        </UiTarjetaCita>
        <p class="det__aviso">Contenido orientativo; no sustituye una valoración presencial. Precios ilustrativos.</p>
      </aside>
    </div>

    <nav class="contenedor det__nav" aria-label="Otros tratamientos">
      <NuxtLink v-if="anterior" :to="`/tratamientos/${anterior.slug}`" class="det__nav-enlace">
        <span class="etiqueta">← {{ anterior.codigo }}</span> {{ anterior.nombre }}
      </NuxtLink>
      <span v-else />
      <NuxtLink v-if="siguiente" :to="`/tratamientos/${siguiente.slug}`" class="det__nav-enlace det__nav-enlace--sig">
        <span class="etiqueta">{{ siguiente.codigo }} →</span> {{ siguiente.nombre }}
      </NuxtLink>
    </nav>
  </article>
</template>

<style scoped>
.det__cabeza {
  padding-block: clamp(1.5rem, 4vw, 3rem) clamp(2rem, 5vw, 4rem);
}

.det__volver {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  text-decoration: none;
}

.det__rejilla {
  display: grid;
  gap: 2rem;
  align-items: center;
}

.det__texto {
  position: relative;
}


.det__titulo {
  margin-top: 0.8rem;
  font-size: clamp(2.6rem, 6vw, 5.2rem);
  line-height: 0.95;
  overflow-wrap: break-word;
  hyphens: auto;
}

.det__linea {
  margin-top: 1rem;
}

.det__datos {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-linea);
}

.det__datos dd {
  font-family: var(--font-serif);
  font-size: 2rem;
  line-height: 1.1;
}

.det__datos dd small {
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.det__datos .det__dato-chico {
  font-family: var(--font-sans);
  font-size: 1.05rem;
  max-width: 18ch;
  margin-top: 0.2rem;
}

.det__acciones {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 1.75rem;
}

.det__ilus {
  max-width: 26rem;
  justify-self: center;
  width: 100%;
  padding: 1.5rem;
  background: var(--color-niebla);
  border: 1px solid var(--color-linea);
  border-radius: 24px;
}

.det__cuerpo {
  display: grid;
  gap: 3rem;
  padding-top: clamp(2rem, 5vw, 3.5rem);
  border-top: 1px solid var(--color-linea);
}

.det__bloque {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.det__parrafo {
  font-size: 1.12rem;
  max-width: 60ch;
}

.det__lista li {
  position: relative;
  padding-left: 1.3rem;
  margin-bottom: 0.5rem;
}

.det__lista li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.62em;
  width: 0.65rem;
  border-top: 1.5px solid var(--color-petroleo);
}

.etapas {
  display: grid;
  gap: 0;
  counter-reset: etapa;
  border-top: 1px solid var(--color-linea);
}

.etapa {
  display: grid;
  grid-template-columns: 2.75rem 1fr;
  column-gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-linea);
}

.etapa__n {
  grid-row: span 2;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-petroleo-oscuro);
}

.etapa__titulo {
  font-size: 1.3rem;
}

.etapa p {
  color: var(--color-tinta-suave);
}

.det__sim {
  padding: clamp(1rem, 3vw, 2rem);
  background: var(--color-niebla);
  border: 1px solid var(--color-linea);
}

.det__quienes {
  display: grid;
  gap: 1rem;
}

.det__quienes li {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.det__avatar {
  width: 4.5rem;
  flex-shrink: 0;
}

.det__faq {
  border-top: 1px solid var(--color-linea);
}

.det__pregunta {
  border-bottom: 1px solid var(--color-linea);
}

.det__pregunta summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 3.5rem;
  padding-block: 0.6rem;
  cursor: pointer;
  font-family: var(--font-serif);
  font-size: 1.3rem;
  list-style: none;
}

.det__pregunta summary::-webkit-details-marker {
  display: none;
}

.det__pregunta summary::after {
  content: "+";
  font-family: var(--font-mono);
  color: var(--color-petroleo-oscuro);
}

.det__pregunta[open] summary::after {
  content: "−";
}

.det__pregunta p {
  padding-bottom: 1rem;
  max-width: 60ch;
}

.det__cierre {
  display: grid;
  gap: 1rem;
  justify-items: center;
}

.det__cierre :deep(.tarjeta) {
  width: min(34rem, 100%);
}

.det__cierre-titulo {
  font-family: var(--font-serif);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  line-height: 1.1;
  padding-top: 0.3rem;
}

.det__cierre-texto {
  margin: 0.5rem 0 1rem;
  line-height: 2rem;
}

.det__aviso {
  font-size: var(--text-chico);
  color: var(--color-tinta-suave);
  text-align: center;
}

.det__nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-linea);
}

.det__nav-enlace {
  display: grid;
  gap: 0.2rem;
  min-height: 2.75rem;
  font-family: var(--font-serif);
  font-size: 1.2rem;
  text-decoration: none;
}

.det__nav-enlace--sig {
  text-align: right;
}

.det__nav-enlace:hover {
  text-decoration: underline;
  text-decoration-color: var(--color-petroleo);
}

@media (min-width: 64rem) {
  .det__rejilla {
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: 4rem;
  }

  .det__cuerpo {
    grid-template-columns: 1fr 1fr;
    column-gap: 5rem;
  }

  .det__bloque--ancho {
    grid-column: 1 / -1;
  }

  .etapas {
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    border-top: 0;
  }

  .etapa {
    grid-template-columns: 1fr;
    align-content: start;
    padding: 1rem 1.25rem 1.25rem 0;
    border-bottom: 0;
    border-top: 1px solid var(--color-linea);
    margin-right: 1rem;
  }

  .etapa__n {
    grid-row: auto;
  }
}
</style>
