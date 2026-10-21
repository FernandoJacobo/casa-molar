<script setup lang="ts">
/**
 * Muestra de tono: recta arriba (la lengüeta del soporte) y redondeada abajo como la corona,
 * con el código impreso. Puede ser decorativa o un botón/radio (vía `as` y atributos).
 */
withDefaults(defineProps<{
  codigo: string
  hex: string
  as?: string
  tamano?: 'chica' | 'media' | 'grande'
}>(), { as: 'span', tamano: 'media' })
</script>

<template>
  <component :is="as" class="pestana" :class="`pestana--${tamano}`" :style="{ '--hex': hex }">
    <span class="pestana__soporte" aria-hidden="true" />
    <span class="pestana__corona" aria-hidden="true" />
    <span class="pestana__codigo">{{ codigo }}</span>
    <slot />
  </component>
</template>

<style scoped>
.pestana {
  --ancho: 2.6rem;
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: var(--ancho);
  padding: 0;
  border: 0;
  background: none;
  color: var(--color-tinta);
  text-decoration: none;
}

.pestana--chica { --ancho: 1.9rem; }
.pestana--grande { --ancho: 3.6rem; }

.pestana__soporte {
  width: 62%;
  height: calc(var(--ancho) * 0.42);
  background: var(--color-tinta);
  border-radius: 1px 1px 0 0;
  position: relative;
}

/* Orificio del soporte. */
.pestana__soporte::after {
  content: "";
  position: absolute;
  top: 30%;
  left: 50%;
  width: 26%;
  aspect-ratio: 1;
  translate: -50% 0;
  border-radius: 50%;
  background: var(--color-blanco);
}

.pestana__corona {
  width: 100%;
  height: calc(var(--ancho) * 1.15);
  background: var(--hex);
  border: 1px solid var(--color-linea);
  border-radius: 2px 2px 46% 46% / 2px 2px 32% 32%;
  transition: background-color 0.6s var(--ease-suave), translate 0.2s var(--ease-suave);
}

.pestana__codigo {
  position: absolute;
  top: calc(var(--ancho) * 0.62);
  font-family: var(--font-mono);
  font-size: calc(var(--ancho) * 0.27);
  font-weight: 700;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .pestana__corona { transition: none; }
}
</style>
