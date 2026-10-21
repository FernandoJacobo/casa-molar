<script setup lang="ts">
import { site } from '~/config/site'

const d = site.direccion
const anio = new Date().getFullYear()
</script>

<template>
  <footer class="pie">
    <div class="contenedor pie__rejilla">
      <div class="pie__intro">
        <LayoutLogoCasa claro />
        <p class="pie__lema">{{ site.lema }}</p>
        <p class="pie__voz">Te explicamos lo que vemos antes de hacer nada.</p>
        <div class="pie__acciones">
          <NuxtLink to="/cita" class="boton boton--primario">Agendar valoración</NuxtLink>
          <a :href="`tel:${site.telefono.enlace}`" class="pie__tel">{{ site.telefono.visible }}</a>
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
          <a :href="`mailto:${site.correo}`">{{ site.correo }}</a>
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
  </footer>
</template>

<style scoped>
.pie {
  position: relative;
  margin-top: clamp(4rem, 10vw, 8rem);
  background: var(--color-tinta);
  color: #D5E2E4;
}

.pie a:not(.boton) {
  color: var(--color-blanco);
}

.pie__rejilla {
  display: grid;
  gap: 2.5rem;
  padding-block: clamp(3rem, 7vw, 5rem) 2.5rem;
}

.pie__lema {
  margin-top: 1.5rem;
  font-family: var(--font-serif);
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  line-height: 1.1;
  color: var(--color-blanco);
}

.pie__voz {
  margin-top: 0.5rem;
  max-width: 30ch;
}

.pie__acciones {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 1.75rem;
}

.pie__acciones .boton--primario {
  --fondo: var(--color-blanco);
  --texto: var(--color-petroleo-oscuro);
  --borde: var(--color-blanco);
}

.pie__acciones .boton--primario:hover {
  --fondo: var(--color-agua);
  --borde: var(--color-agua);
}

.pie__tel {
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
}

.pie__titulo {
  margin: 1.75rem 0 0.6rem;
  color: #8FC4D0;
}

.pie__titulo:first-child {
  margin-top: 0;
}

.pie__horario div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.4rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.12);
  font-size: 0.95rem;
}

.pie__horario dd {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.pie__nota {
  opacity: 0.75;
}

.pie__direccion {
  font-style: normal;
  line-height: 1.6;
}

.pie__enlaces {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
}

.pie__enlaces a {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  text-decoration: none;
}

.pie__enlaces a:hover,
.pie__direccion a:hover,
.pie__tel:hover {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.pie__mapa :deep(svg) {
  border-radius: 14px;
  overflow: hidden;
}

.pie__referencia {
  margin-top: 0.6rem;
  text-transform: none;
  letter-spacing: 0.01em;
  font-weight: 400;
  font-size: 0.85rem;
  color: #B5C8CC;
}

.pie__legal {
  display: grid;
  gap: 0.75rem;
  padding-block: 1.5rem 2rem;
  border-top: 1px solid rgb(255 255 255 / 0.12);
  font-size: 0.85rem;
  color: #B5C8CC;
}

.pie__aviso strong {
  color: var(--color-blanco);
}

.pie__credito a {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.pie__credito {
  text-transform: none;
  letter-spacing: 0.01em;
  font-weight: 400;
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
