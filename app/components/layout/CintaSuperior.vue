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
  </div>
</template>

<style scoped>
.cinta {
  background: var(--color-petroleo-oscuro);
  color: var(--color-blanco);
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

.cinta .etiqueta {
  text-transform: none;
  letter-spacing: 0.01em;
  font-weight: 500;
  font-size: 0.82rem;
}

.cinta__horario {
  display: none;
  gap: 0.6rem;
}

.cinta__sep {
  opacity: 0.5;
}

.cinta__estado {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.cinta__estado strong {
  font-weight: 700;
}

.cinta__marca {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #9FB3B8;
}

.cinta__marca.is-abierto {
  background: #7FD6B4;
}

.cinta__detalle {
  opacity: 0.85;
}

.cinta__urgencias a {
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: rgb(255 255 255 / 0.5);
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
