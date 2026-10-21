<script setup lang="ts">
import { equipo } from '~/data/equipo'
</script>

<template>
  <section class="equipo" aria-labelledby="equipo-titulo">
    <div class="contenedor">
      <UiCabezaSeccion id="equipo-titulo" num="18" rotulo="Quiénes te atienden" titulo="Cuatro especialistas, un mismo criterio.">
        Te atiende siempre la misma persona en cada tratamiento. Personas y datos ficticios, como todo en este demo.
      </UiCabezaSeccion>

      <ol class="equipo__escalera">
        <li v-for="p in equipo" :key="p.id" class="persona">
          <div class="persona__retrato">
            <SvgAvatarSvg :avatar="p.avatar" :nombre="p.nombre" />
          </div>
          <p class="etiqueta persona__rol">{{ p.rol }}</p>
          <h3 class="persona__nombre">{{ p.nombre }}</h3>
          <p class="persona__anios mono">{{ p.anios }} años de práctica <span>(ficticios)</span></p>
          <p class="persona__disfruta"><span class="etiqueta">Lo que más disfruta</span> {{ p.disfruta }}</p>
        </li>
      </ol>
      <NuxtLink to="/equipo" class="enlace equipo__mas">Conoce al equipo completo</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.equipo {
  padding-block: clamp(4rem, 9vw, 8rem);
}

.equipo__escalera {
  display: grid;
  gap: 2.5rem 1.5rem;
  margin-top: clamp(2.5rem, 6vw, 4rem);
}

.persona__retrato {
  display: grid;
  place-items: end center;
  padding: 1.5rem 1.5rem 0;
  border-radius: 20px;
  background: var(--color-niebla);
}

.persona__retrato :deep(svg) {
  width: min(100%, 11rem);
}

.persona__rol {
  margin-top: 1.1rem;
  color: var(--color-petroleo);
}

.persona__nombre {
  font-size: 1.45rem;
  margin-top: 0.3rem;
  line-height: 1.1;
}

.persona__anios {
  font-size: 0.85rem;
  margin-top: 0.35rem;
  color: var(--color-tinta-suave);
}

.persona__disfruta {
  margin-top: 0.9rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--color-linea);
  font-size: 0.97rem;
  max-width: 34ch;
}

.persona__disfruta .etiqueta {
  display: block;
  margin-bottom: 0.25rem;
  color: var(--color-tinta-suave);
}

.equipo__mas {
  display: inline-block;
  margin-top: 2.5rem;
}

@media (min-width: 40rem) {
  .equipo__escalera {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 64rem) {
  .equipo__escalera {
    grid-template-columns: repeat(4, 1fr);
    align-items: start;
  }
}
</style>
