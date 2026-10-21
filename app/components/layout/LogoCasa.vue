<script setup lang="ts">
import { site } from '~/config/site'

defineProps<{ claro?: boolean }>()
</script>

<template>
  <span class="logo" :class="{ 'logo--claro': claro }">
    <svg class="logo__pieza" viewBox="-6.5 -6.5 13 13" aria-hidden="true" focusable="false">
      <use href="#pz-molar" />
    </svg>
    <span class="logo__texto">
      <span class="logo__nombre">{{ site.nombre }}</span>
      <span class="logo__sufijo">{{ site.sufijo }}</span>
    </span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  color: var(--color-tinta);
}

.logo__pieza {
  width: 2.1rem;
  height: 2.1rem;
  --pz-relleno: var(--color-coral);
  --pz-grosor: 1.6px;
  rotate: -8deg;
}

.logo__texto {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo__nombre {
  font-family: var(--font-serif);
  font-size: 1.45rem;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.logo__sufijo {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin-top: 0.2rem;
  color: var(--color-tinta-suave);
}

.logo--claro {
  color: var(--color-marfil);
}

.logo--claro .logo__sufijo {
  color: var(--color-hueso);
}
</style>
