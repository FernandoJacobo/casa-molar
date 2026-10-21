<script setup lang="ts">
/**
 * Tarjeta de cita: cabecera con etiqueta y folio, cuerpo libre.
 * Se usa como CTA del hero, contenedor del agendador y confirmación.
 */
withDefaults(defineProps<{
  folio?: string
  etiqueta?: string
  as?: string
}>(), { folio: '', etiqueta: 'Tarjeta de cita', as: 'div' })
</script>

<template>
  <component :is="as" class="tarjeta">
    <div class="tarjeta__cabeza">
      <span class="etiqueta">{{ etiqueta }}</span>
      <span v-if="folio" class="etiqueta tarjeta__folio">Folio {{ folio }}</span>
    </div>
    <div class="tarjeta__cuerpo">
      <slot />
    </div>
  </component>
</template>

<style scoped>
.tarjeta {
  position: relative;
  display: block;
  overflow: hidden;
  background: var(--color-blanco);
  border: 1px solid var(--color-linea);
  border-radius: var(--radius-tarjeta);
  box-shadow: var(--shadow-suave);
  color: var(--color-tinta);
}

.tarjeta__cabeza {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-agua);
  color: var(--color-petroleo-oscuro);
}

.tarjeta__folio {
  font-variant-numeric: tabular-nums;
}

.tarjeta__cuerpo {
  padding: 1.1rem 1.25rem 1.35rem;
}
</style>
