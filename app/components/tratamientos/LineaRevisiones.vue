<script setup lang="ts">
/**
 * Línea de tiempo ilustrada de las revisiones mensuales de ortodoncia: en cada mes, tres piezas
 * se van enderezando (ilustrativo).
 */
import { pesos } from '~/utils/formato'

const props = withDefaults(defineProps<{ meses?: number; mensualidad?: number; enganche?: number }>(), { meses: 18, mensualidad: 800, enganche: 3600 })

const hitos = computed(() =>
  Array.from({ length: props.meses + 1 }, (_, i) => {
    const avance = i / props.meses
    return { mes: i, giro: (1 - avance) * 14, desfase: (1 - avance) * 4 }
  }),
)
const visibles = computed(() => hitos.value.filter(h => h.mes % 3 === 0 || h.mes === props.meses))
</script>

<template>
  <figure class="linea">
    <div class="linea__pista">
      <div v-for="h in visibles" :key="h.mes" class="linea__hito" :style="{ left: `${(h.mes / meses) * 100}%` }">
        <svg viewBox="0 0 60 40" class="linea__piezas" aria-hidden="true">
          <g :transform="`translate(14 6) rotate(${h.giro} 6 14)`"><rect width="12" height="26" rx="2" ry="6" /></g>
          <g :transform="`translate(24 ${6 - h.desfase})`"><rect width="12" height="28" rx="2" ry="6" /></g>
          <g :transform="`translate(34 6) rotate(${-h.giro} 6 14)`"><rect width="12" height="26" rx="2" ry="6" /></g>
        </svg>
        <span class="linea__mes mono">{{ h.mes === 0 ? 'Inicio' : `Mes ${h.mes}` }}</span>
      </div>
      <div class="linea__ticks" aria-hidden="true">
        <span v-for="i in meses + 1" :key="i" :style="{ left: `${((i - 1) / meses) * 100}%` }" />
      </div>
    </div>
    <figcaption class="linea__pie">
      <p><strong>Una revisión al mes</strong>, de unos 30 minutos. Ilustrativo: un caso típico de {{ meses }} meses
        con enganche de {{ pesos(enganche) }} y {{ meses }} mensualidades de {{ pesos(mensualidad) }} (precios ilustrativos).</p>
    </figcaption>
  </figure>
</template>

<style scoped>
.linea {
  padding: 1.5rem 1.25rem 1.25rem;
  border: 1px solid var(--color-linea);
  background: var(--color-blanco);
}

.linea__pista {
  position: relative;
  height: 7rem;
  margin-inline: 1.5rem;
}

.linea__hito {
  position: absolute;
  top: 0;
  translate: -50% 0;
  display: grid;
  justify-items: center;
  gap: 0.3rem;
}

.linea__piezas {
  width: 3.4rem;
}

.linea__piezas rect {
  fill: var(--color-blanco);
  stroke: var(--color-tinta);
  stroke-width: 1.4;
}

.linea__hito:last-child .linea__piezas rect,
.linea__hito:nth-last-child(2) .linea__piezas rect {
  fill: var(--color-menta);
}

.linea__mes {
  font-size: 0.68rem;
  white-space: nowrap;
}

.linea__ticks {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.4rem;
  height: 10px;
  border-top: 1px solid var(--color-linea);
}

.linea__ticks span {
  position: absolute;
  top: 0;
  width: 1.5px;
  height: 8px;
  background: var(--color-petroleo);
  translate: -50% 0;
}

.linea__pie {
  margin-top: 1rem;
  font-size: 0.95rem;
}

@media (max-width: 39.99rem) {
  .linea__hito:nth-child(even):not(:nth-last-child(2)) {
    display: none;
  }
}
</style>
