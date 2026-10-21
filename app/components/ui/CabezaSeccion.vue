<script setup lang="ts">
/** Encabezado de sección: rótulo, título y entrada opcional. `num` queda como referencia interna. */
withDefaults(defineProps<{
  num?: string
  rotulo: string
  titulo: string
  as?: 'h1' | 'h2'
  id?: string
}>(), { as: 'h2', id: undefined })
</script>

<template>
  <div class="cabeza">
    <p class="seccion-num"><span>{{ rotulo }}</span></p>
    <component :is="as" :id="id" class="h2 cabeza__titulo">{{ titulo }}</component>
    <div v-if="$slots.default" class="cabeza__entrada">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cabeza__titulo {
  margin-top: 0.8rem;
}

.cabeza__entrada {
  margin-top: 1.1rem;
  font-size: clamp(1.05rem, 1.4vw, 1.2rem);
  max-width: 40ch;
  color: var(--color-tinta-suave);
}
</style>
