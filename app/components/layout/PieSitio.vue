<script setup lang="ts">
import { site } from '~/config/site'

const d = site.direccion
const anio = new Date().getFullYear()
</script>

<template>
  <footer class="pie">
    <div class="contenedor pie__rejilla">
      <div class="pie__intro">
        <SvgSonrisaSvg variante="linea" class="pie__sonrisa" />
        <p class="pie__lema">{{ site.lema }}</p>
        <p class="pie__voz">Te explicamos lo que vemos antes de hacer nada.</p>
        <div class="pie__acciones">
          <NuxtLink to="/cita" class="boton boton--coral">Agendar valoración</NuxtLink>
          <a :href="`tel:${site.telefono.enlace}`" class="enlace">{{ site.telefono.visible }}</a>
        </div>
      </div>

      <div class="pie__datos">
        <h2 class="etiqueta pie__titulo">Horario</h2>
        <dl class="pie__horario">
          <div v-for="h in site.horarioTexto" :key="h.dias">
            <dt>{{ h.dias }}</dt>
            <dd>{{ h.horas }}<span v-if="h.nota" class="pie__nota"> · {{ h.nota }}</span></dd>
          </div>
        </dl>

        <h2 class="etiqueta pie__titulo">Dónde</h2>
        <address class="pie__direccion">
          {{ d.calle }}, {{ d.colonia }}<br>
          {{ d.ciudad }}, {{ d.estado }}<br>
          <a :href="`mailto:${site.correo}`" class="enlace">{{ site.correo }}</a>
        </address>

        <h2 class="etiqueta pie__titulo">Sitio</h2>
        <ul class="pie__enlaces">
          <li><NuxtLink to="/tratamientos">Tratamientos</NuxtLink></li>
          <li><NuxtLink to="/precios">Precios</NuxtLink></li>
          <li><NuxtLink to="/cita">Agenda</NuxtLink></li>
          <li><NuxtLink to="/equipo">Equipo</NuxtLink></li>
          <li><NuxtLink to="/cepillado">Cronómetro de cepillado</NuxtLink></li>
          <li><NuxtLink to="/aviso-de-privacidad">Aviso de privacidad</NuxtLink></li>
          <li v-for="r in site.redes" :key="r.nombre"><a :href="r.href">{{ r.nombre }}</a></li>
        </ul>
      </div>

      <div class="pie__mapa">
        <SvgMapaIlustrado compacto />
        <p class="etiqueta pie__referencia">{{ d.referencia }}</p>
      </div>
    </div>

    <div class="contenedor pie__legal">
      <p class="pie__aviso">
        <strong>{{ site.avisoDemo }}</strong>
        {{ site.cedula }}. © {{ anio }} {{ site.nombre }} (demo).
      </p>
      <p class="pie__credito etiqueta">
        {{ site.credito.texto }} ·
        <a :href="site.credito.url" target="_blank" rel="noopener">{{ site.credito.visible }}</a>
      </p>
    </div>

    <p class="pie__gigante" aria-hidden="true">{{ site.nombre }}</p>
  </footer>
</template>

<style scoped>
.pie {
  position: relative;
  margin-top: clamp(4rem, 10vw, 8rem);
  background: var(--color-hueso);
  border-top: 1.5px solid var(--color-tinta);
  overflow: hidden;
}

.pie__rejilla {
  display: grid;
  gap: 2.5rem;
  padding-block: clamp(2.5rem, 6vw, 4.5rem) 2.5rem;
}

.pie__sonrisa {
  width: min(15rem, 70%);
  color: var(--color-tinta);
  margin-bottom: 1rem;
}

.pie__lema {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
}

.pie__voz {
  margin-top: 0.6rem;
  color: var(--color-tinta-suave);
  max-width: 28ch;
}

.pie__acciones {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 1.5rem;
}

.pie__titulo {
  color: var(--color-coral-oscuro);
  margin: 1.4rem 0 0.4rem;
}

.pie__titulo:first-child {
  margin-top: 0;
}

.pie__horario div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.2rem;
  border-bottom: 1px dotted var(--color-arena-oscura);
}

.pie__horario dt {
  font-weight: 500;
}

.pie__horario dd {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  text-align: right;
}

.pie__nota {
  color: var(--color-tinta-suave);
}

.pie__direccion {
  font-style: normal;
}

.pie__enlaces {
  display: flex;
  flex-wrap: wrap;
  gap: 0.1rem 1.2rem;
}

.pie__enlaces a {
  display: inline-block;
  padding-block: 0.55rem;
  text-decoration: underline;
  text-decoration-color: var(--color-arena-oscura);
  text-underline-offset: 0.2em;
}

.pie__enlaces a:hover {
  text-decoration-color: var(--color-coral);
}

.pie__mapa :deep(.mapa) {
  border: 1.5px solid var(--color-tinta);
}

.pie__referencia {
  margin-top: 0.6rem;
  color: var(--color-tinta-suave);
  text-transform: none;
  letter-spacing: 0.02em;
}

.pie__legal {
  display: grid;
  gap: 0.75rem;
  padding-block: 1.25rem;
  border-top: 1px dashed var(--color-arena-oscura);
  font-size: var(--text-chico);
}

.pie__aviso strong {
  font-weight: 700;
}

.pie__credito a {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

/* El nombre gigante queda cortado por el borde inferior. */
.pie__gigante {
  font-family: var(--font-serif);
  font-size: clamp(5rem, 21vw, 22rem);
  line-height: 0.8;
  letter-spacing: -0.045em;
  white-space: nowrap;
  margin: 0.5rem 0 -0.16em;
  padding-left: calc(var(--margen) - 0.06em);
  color: var(--color-tinta);
  user-select: none;
}

@media (min-width: 48rem) {
  .pie__rejilla {
    grid-template-columns: 1.1fr 1fr;
  }

  .pie__mapa {
    grid-column: 1 / -1;
  }
}

@media (min-width: 64rem) {
  .pie__rejilla {
    grid-template-columns: 1.2fr 1fr 1.1fr;
    align-items: start;
  }

  .pie__mapa {
    grid-column: auto;
  }

  .pie__legal {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
}
</style>
