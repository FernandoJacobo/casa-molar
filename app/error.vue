<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const es404 = computed(() => props.error.statusCode === 404)

useHead({ title: es404.value ? 'Página no encontrada' : 'Algo salió mal' })
useSeoMeta({ robots: 'noindex, nofollow' })

const volver = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
    <div class="error contenedor">
      <div class="error__texto">
        <p class="etiqueta error__codigo">Error {{ error.statusCode }}</p>
        <h1 class="error__titulo">
          <template v-if="es404">Esta página no tiene caries, pero tampoco existe.</template>
          <template v-else>Algo se nos rompió. No fuiste tú.</template>
        </h1>
        <p class="error__sub">{{ es404 ? 'Puede que el enlace esté mal escrito o que la página se haya movido.' : 'Intenta de nuevo en un momento.' }}</p>
        <div class="error__acciones">
          <button type="button" class="boton boton--primario" @click="volver">Ir al inicio</button>
          <NuxtLink to="/cita" class="enlace">Agendar una cita</NuxtLink>
          <NuxtLink to="/tratamientos" class="enlace">Ver tratamientos</NuxtLink>
        </div>
      </div>
      <figure class="error__fig">
        <SvgSillonSvg />
        <figcaption class="mono">Sillón 3 · libre</figcaption>
      </figure>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.error {
  display: grid;
  gap: 2.5rem;
  align-items: center;
  min-height: 60vh;
  padding-block: clamp(3rem, 8vw, 6rem);
}

.error__codigo {
  color: var(--color-petroleo-oscuro);
}

.error__titulo {
  margin-top: 0.8rem;
  max-width: 16ch;
  font-family: var(--font-serif);
  font-size: clamp(2.3rem, 6vw, 4.4rem);
  line-height: 1.02;
  letter-spacing: -0.015em;
}

.error__sub {
  margin-top: 1rem;
  max-width: 34rem;
  color: var(--color-tinta-suave);
}

.error__acciones {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.5rem;
  margin-top: 2rem;
}

.error__fig {
  max-width: 24rem;
  justify-self: center;
}

.error__fig figcaption {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
  color: var(--color-tinta-suave);
}

@media (min-width: 64rem) {
  .error {
    grid-template-columns: 1.4fr 1fr;
  }
}
</style>
