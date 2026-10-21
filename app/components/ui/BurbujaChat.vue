<script setup lang="ts">
/** Burbuja de chat genérica (sin colores ni marca de ninguna app). */
withDefaults(defineProps<{
  nombre: string
  hora?: string
  lado?: 'izq' | 'der'
  ficticia?: boolean
}>(), { hora: '', lado: 'izq', ficticia: true })
</script>

<template>
  <figure class="burbuja" :class="`burbuja--${lado}`">
    <blockquote class="burbuja__texto">
      <slot />
    </blockquote>
    <figcaption class="burbuja__pie">
      <span class="burbuja__nombre">{{ nombre }}</span>
      <span v-if="ficticia" class="burbuja__ficticia">(reseña ficticia)</span>
      <span v-if="hora" class="burbuja__hora">{{ hora }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.burbuja {
  max-width: min(30rem, 88%);
  justify-self: start;
}

.burbuja--der {
  justify-self: end;
}

.burbuja__texto {
  margin: 0;
  padding: 0.85rem 1.05rem;
  background: var(--color-marfil);
  border: 1.5px solid var(--color-tinta);
  border-radius: 18px 18px 18px 3px;
  font-size: 1.02rem;
  line-height: 1.45;
}

.burbuja--der .burbuja__texto {
  background: var(--color-tinta);
  color: var(--color-marfil);
  border-radius: 18px 18px 3px 18px;
}

.burbuja__pie {
  display: flex;
  flex-wrap: wrap;
  gap: 0.15rem 0.6rem;
  margin-top: 0.4rem;
  padding-inline: 0.3rem;
  font-family: var(--font-mono);
  font-size: var(--text-etiqueta);
  letter-spacing: 0.04em;
  color: var(--color-tinta-suave);
}

.burbuja--der .burbuja__pie {
  justify-content: flex-end;
}

.burbuja__nombre {
  font-weight: 700;
  color: var(--color-tinta);
}

.burbuja__ficticia {
  color: var(--color-coral-oscuro);
}
</style>
