<script setup lang="ts">
import { site } from '~/config/site'
</script>

<template>
  <nav class="barra" aria-label="Acciones rápidas">
    <a :href="`tel:${site.telefono.enlace}`" class="barra__accion">
      <span class="etiqueta">Llamar</span>
      <span class="barra__dato">{{ site.telefono.visible }}</span>
    </a>
    <NuxtLink to="/cita" class="barra__accion barra__accion--cta">
      <span class="etiqueta">Agendar</span>
      <span class="barra__dato">valoración</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.barra {
  position: fixed;
  inset: auto 0 0;
  z-index: 40;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  height: var(--barra-movil);
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--color-marfil);
  border-top: 1.5px solid var(--color-tinta);
}

.barra__accion {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: 1rem;
  text-decoration: none;
  line-height: 1.15;
  transition: transform 0.1s;
}

.barra__accion:active {
  transform: translateY(2px);
}

.barra__accion--cta {
  background: var(--color-coral);
  border-left: 1.5px solid var(--color-tinta);
}

.barra__dato {
  font-family: var(--font-serif);
  font-size: 1.15rem;
}

@media (min-width: 48rem) {
  .barra {
    display: none;
  }
}
</style>
