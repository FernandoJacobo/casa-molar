<script setup lang="ts">
import { equipo } from '~/data/equipo'
import { tratamientos } from '~/data/tratamientos'
</script>

<template>
  <div class="contenedor" style="padding-block: 3rem; display: grid; gap: 3rem">
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem">
      <SvgAvatarSvg v-for="p in equipo" :key="p.id" :avatar="p.avatar" />
    </div>
    <div style="background: var(--color-placa); padding: 2rem">
      <SvgPanoramicaSvg />
    </div>
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem">
      <div v-for="t in tratamientos" :key="t.slug" style="border: 1px solid; background: var(--color-hueso)">
        <SvgIlustracionTratamiento :slug="t.slug" />
        <p class="etiqueta">{{ t.slug }}</p>
      </div>
      <SvgSillonSvg />
    </div>
  </div>
</template>
