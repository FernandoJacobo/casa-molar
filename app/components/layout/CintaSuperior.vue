<script setup lang="ts">
import { site } from '~/config/site'

const estado = useEstadoClinica()
</script>

<template>
  <div class="cinta">
    <div class="contenedor cinta__fila">
      <p class="cinta__horario etiqueta">
        <span>L–V 9:00–19:00</span>
        <span class="cinta__sep" aria-hidden="true">/</span>
        <span>Sáb 9:00–14:00</span>
      </p>
      <p class="cinta__estado etiqueta" aria-live="polite">
        <template v-if="estado">
          <span class="cinta__marca" :class="{ 'is-abierto': estado.abierto }" aria-hidden="true" />
          <strong>{{ estado.titulo }}</strong>
          <span v-if="estado.detalle" class="cinta__detalle">· {{ estado.detalle }}</span>
        </template>
        <span v-else>Horario de hoy</span>
      </p>
      <p class="cinta__urgencias etiqueta">
        Urgencias:
        <a :href="`tel:${site.urgencias.enlace}`">{{ site.urgencias.visible }}</a>
      </p>
    </div>
    <div class="regla" aria-hidden="true" />
  </div>
</template>

<style scoped>
.cinta {
  background: var(--color-hueso);
  color: var(--color-tinta);
}

.cinta__fila {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1.5rem;
  min-height: 2.4rem;
  padding-block: 0.45rem;
  flex-wrap: wrap;
}

.cinta__horario {
  display: none;
  gap: 0.6rem;
}

.cinta__sep {
  color: var(--color-arena-oscura);
}

.cinta__estado {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.cinta__estado strong {
  font-weight: 700;
}

/* Marca de estado: una muestra de tono en miniatura, no un puntito verde. */
.cinta__marca {
  width: 0.55rem;
  height: 0.8rem;
  border: 1.5px solid var(--color-tinta);
  border-radius: 1px 1px 45% 45% / 1px 1px 35% 35%;
  background: var(--color-arena);
}

.cinta__marca.is-abierto {
  background: var(--color-menta);
}

.cinta__detalle {
  color: var(--color-tinta-suave);
}

.cinta__urgencias a {
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: var(--color-coral);
  text-underline-offset: 0.2em;
  white-space: nowrap;
}

@media (max-width: 30rem) {
  .cinta__detalle {
    display: none;
  }
}

@media (min-width: 64rem) {
  .cinta__horario {
    display: flex;
  }
}
</style>
