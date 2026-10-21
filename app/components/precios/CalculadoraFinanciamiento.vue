<script setup lang="ts">
import { site } from '~/config/site'
import { calcularFinanciamiento } from '~/utils/financiamiento'
import { pesos, pesosCentavos } from '~/utils/formato'

const props = defineProps<{ totalPlan?: number }>()

const f = site.financiamiento
const monto = ref(18000)
const enganche = ref(0)
const plazo = ref(6)

const plazos = [
  ...f.plazosSinIntereses.map(m => ({ meses: m, tasa: 0, texto: `${m} MSI` })),
  ...f.plazosConIntereses.map(m => ({ meses: m, tasa: f.tasaAnual, texto: `${m} meses` })),
]
const opcion = computed(() => plazos.find(p => p.meses === plazo.value)!)
const r = computed(() => calcularFinanciamiento({ monto: monto.value || 0, enganche: enganche.value || 0, plazo: plazo.value, tasaAnual: opcion.value.tasa }))
const debajoMinimo = computed(() => r.value.financiado > 0 && r.value.financiado < f.montoMinimo)

function usarPlan() {
  if (props.totalPlan) monto.value = props.totalPlan
}
</script>

<template>
  <div class="fin">
    <form class="fin__form" @submit.prevent>
      <label class="fin__campo">
        <span class="etiqueta">Monto del tratamiento</span>
        <span class="fin__entrada">
          <span class="mono" aria-hidden="true">$</span>
          <input v-model.number="monto" type="number" inputmode="numeric" min="0" step="100" aria-describedby="fin-plan">
        </span>
        <input v-model.number="monto" type="range" min="1500" max="80000" step="500" class="fin__rango" aria-label="Ajustar monto">
      </label>
      <button v-if="totalPlan" id="fin-plan" type="button" class="enlace fin__plan" @click="usarPlan">Usar el total de mi plan ({{ pesos(totalPlan) }})</button>

      <label class="fin__campo">
        <span class="etiqueta">Enganche (opcional)</span>
        <span class="fin__entrada">
          <span class="mono" aria-hidden="true">$</span>
          <input v-model.number="enganche" type="number" inputmode="numeric" min="0" step="100">
        </span>
      </label>

      <fieldset class="fin__campo fin__plazos">
        <legend class="etiqueta">Plazo</legend>
        <label v-for="p in plazos" :key="p.meses" class="fin__plazo" :class="{ 'is-elegido': plazo === p.meses, 'is-tasa': p.tasa > 0 }">
          <input v-model="plazo" type="radio" name="plazo" :value="p.meses" class="sr-only">
          <span class="mono">{{ p.texto }}</span>
        </label>
      </fieldset>
    </form>

    <div class="fin__resultado" aria-live="polite">
      <p class="etiqueta">Mensualidad</p>
      <p class="fin__mensualidad">{{ pesosCentavos(r.mensualidad) }}</p>
      <p class="fin__x mono">× {{ plazo }} {{ plazo === 1 ? 'mes' : 'meses' }}{{ opcion.tasa ? ` · tasa anual ${(opcion.tasa * 100).toFixed(0)} % (ilustrativa)` : ' · sin intereses' }}</p>
      <dl class="fin__desglose">
        <div><dt>Enganche</dt><dd class="mono">{{ pesos(Math.min(enganche || 0, monto || 0)) }}</dd></div>
        <div><dt>A financiar</dt><dd class="mono">{{ pesos(r.financiado) }}</dd></div>
        <div><dt>Intereses</dt><dd class="mono">{{ pesosCentavos(r.intereses) }}</dd></div>
        <div class="fin__total"><dt>Total a pagar</dt><dd class="mono">{{ pesosCentavos(r.total) }}</dd></div>
      </dl>
      <p v-if="debajoMinimo" class="fin__alerta">Los meses sin intereses aplican desde {{ pesos(f.montoMinimo) }} a financiar.</p>
      <p class="fin__aviso">Simulación ilustrativa. Plazos y tasas de ejemplo; sujetos a aprobación y a la valoración.</p>
    </div>
  </div>
</template>

<style scoped>
.fin {
  display: grid;
  gap: 2rem;
}

.fin > *,
.fin__form {
  min-width: 0;
}

.fin__form {
  display: grid;
  gap: 1.4rem;
}

.fin__campo {
  display: grid;
  gap: 0.45rem;
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.fin__entrada {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-bottom: 1px solid var(--color-linea-fuerte);
}

.fin__entrada .mono {
  font-size: 1.6rem;
  color: var(--color-tinta-suave);
}

.fin__entrada input {
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 3.2rem;
  border: 0;
  background: transparent;
  font-family: var(--font-serif);
  font-size: 2rem;
  font-variant-numeric: tabular-nums;
}

.fin__entrada:focus-within {
  border-bottom-color: var(--color-petroleo-oscuro);
  box-shadow: 0 1.5px 0 var(--color-petroleo-oscuro);
}

.fin__entrada input:focus-visible {
  outline: none;
}

.fin__rango {
  accent-color: var(--color-petroleo-oscuro);
  width: 100%;
  min-height: 2.75rem;
}

.fin__plan {
  justify-self: start;
  border: 0;
  background: none;
  padding: 0.5rem 0;
  font-size: 0.95rem;
  text-align: left;
}

.fin__plazos {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.fin__plazos legend {
  margin-bottom: 0.45rem;
}

.fin__plazo {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0 0.85rem;
  border: 1px solid var(--color-linea);
  border-radius: 8px;
  cursor: pointer;
  background: var(--color-blanco);
}

.fin__plazo.is-tasa {
  border-style: dashed;
}

.fin__plazo.is-elegido {
  background: var(--color-petroleo);
  color: var(--color-blanco);
}

.fin__plazo:has(input:focus-visible) {
  outline: 2.5px solid var(--color-petroleo-oscuro);
  outline-offset: 2px;
}

.fin__resultado {
  padding: 1.75rem;
  border-radius: var(--radius-tarjeta);
  background: var(--color-tinta);
  color: var(--color-blanco);
}

.fin__resultado .etiqueta {
  color: var(--color-celeste);
}

.fin__mensualidad {
  font-family: var(--font-serif);
  font-size: clamp(2.8rem, 7vw, 4.6rem);
  line-height: 1;
  margin-top: 0.3rem;
  color: var(--color-celeste);
  font-variant-numeric: tabular-nums;
}

.fin__x {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: var(--color-linea);
}

.fin__desglose {
  margin-top: 1.25rem;
  border-top: 1px solid rgb(255 255 255 / 0.3);
}

.fin__desglose div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.45rem;
  border-bottom: 1px dotted rgb(255 255 255 / 0.25);
}

.fin__total {
  font-weight: 700;
}

.fin__alerta {
  margin-top: 0.8rem;
  color: var(--color-celeste);
  font-size: var(--text-chico);
}

.fin__aviso {
  margin-top: 0.8rem;
  font-size: 0.8rem;
  color: var(--color-linea);
}

@media (min-width: 64rem) {
  .fin {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
  }
}
</style>
