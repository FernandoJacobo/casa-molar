<script setup lang="ts">
/**
 * Arma tu plan: eliges tratamientos y, en los que se cobran por pieza, las piezas en el odontograma.
 * El resultado es una hoja de plan imprimible. Se guarda en este navegador (localStorage).
 */
import { site } from '~/config/site'
import { piezas } from '~/data/piezas'
import { tratamientos, tratamientoPorSlug } from '~/data/tratamientos'
import { calcularPlan, piezasValidas, type SeleccionPlan } from '~/utils/plan'
import { pesos } from '~/utils/formato'
import { armarMensaje } from '~/utils/whatsapp'

const emit = defineEmits<{ total: [number] }>()

const seleccion = useLocalStorage<SeleccionPlan[]>('casa-molar:plan', [], { initOnMounted: true })
const editando = ref<string | null>(null)
const route = useRoute()
const { enviar } = useWhatsapp()

onMounted(() => {
  const agregar = route.query.agregar
  if (typeof agregar === 'string' && tratamientoPorSlug(agregar) && !elegido(agregar)) {
    alternar(agregar)
  }
})

const elegido = (slug: string) => seleccion.value.some(s => s.slug === slug)

function alternar(slug: string) {
  if (elegido(slug)) {
    seleccion.value = seleccion.value.filter(s => s.slug !== slug)
    if (editando.value === slug) editando.value = null
  }
  else {
    seleccion.value = [...seleccion.value, { slug, piezas: [] }]
    if (tratamientoPorSlug(slug)?.porPieza) editando.value = slug
  }
}

const tEditando = computed(() => (editando.value ? tratamientoPorSlug(editando.value) : undefined))
const habilitadas = computed(() => (tEditando.value ? piezasValidas(tEditando.value, piezas.map(p => p.fdi), piezas) : []))
const piezasEditando = computed({
  get: () => seleccion.value.find(s => s.slug === editando.value)?.piezas ?? [],
  set: (v: number[]) => {
    seleccion.value = seleccion.value.map(s => (s.slug === editando.value ? { ...s, piezas: v } : s))
  },
})

const plan = computed(() => calcularPlan(seleccion.value, tratamientos, piezas))
const todasLasPiezas = computed(() => [...new Set(plan.value.lineas.flatMap(l => l.piezas))])
watch(() => plan.value.total, t => emit('total', t), { immediate: true })

const folio = computed(() => `PT-${String(plan.value.total).padStart(6, '0').slice(-6)}`)
const hoy = ref('')
onMounted(() => (hoy.value = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })))

function mensaje() {
  const lineas = plan.value.lineas.filter(l => !l.pendiente).map(l =>
    `${l.codigo} ${l.nombre}${l.piezas.length ? ` (piezas ${l.piezas.join(', ')})` : ''}: ${pesos(l.subtotal)}`,
  )
  return armarMensaje('Hola, quiero revisar este plan de tratamiento', [
    ...lineas.map((l, i) => [`${i + 1}`, l] as [string, string]),
    ['Total estimado', pesos(plan.value.total)],
    ['Citas aprox.', plan.value.citas],
  ], 'Sé que los precios son "desde" y se confirman en la valoración.')
}

function imprimir() {
  window.print()
}

const consultaPlan = computed(() => ({ motivo: 'plan', plan: seleccion.value.map(s => s.slug).join(',') }))
</script>

<template>
  <div class="plan">
    <div class="plan__armar">
      <h3 class="etiqueta plan__paso">1 · Elige tratamientos</h3>
      <ul class="plan__opciones">
        <li v-for="t in tratamientos" :key="t.slug" class="opcion" :class="{ 'is-elegida': elegido(t.slug) }">
          <label class="opcion__label">
            <input type="checkbox" class="opcion__check" :checked="elegido(t.slug)" @change="alternar(t.slug)">
            <span class="opcion__caja" aria-hidden="true" />
            <span class="opcion__nombre">{{ t.nombre }}</span>
            <span class="opcion__precio mono">{{ pesos(t.desde) }}<small>{{ t.porPieza ? ' /pieza' : '' }}</small></span>
          </label>
          <button
            v-if="t.porPieza && elegido(t.slug)"
            type="button"
            class="opcion__piezas etiqueta"
            :aria-pressed="editando === t.slug"
            @click="editando = editando === t.slug ? null : t.slug"
          >
            {{ (seleccion.find(s => s.slug === t.slug)?.piezas.length ?? 0) || 'Elegir' }} {{ (seleccion.find(s => s.slug === t.slug)?.piezas.length ?? 0) === 1 ? 'pieza' : 'piezas' }}
          </button>
        </li>
      </ul>

      <div v-if="tEditando" class="plan__odonto">
        <h3 class="etiqueta plan__paso">2 · Piezas para {{ tEditando.nombre.toLowerCase() }}</h3>
        <p class="plan__ayuda">Toca las piezas. Las que se ven tenues no aplican para este tratamiento.</p>
        <OdontogramaInteractivo
          v-model="piezasEditando"
          multiple
          :habilitadas="habilitadas"
          :etiqueta="`Elige las piezas para ${tEditando.nombre}`"
        />
        <button type="button" class="boton boton--claro plan__listo" @click="editando = null">Listo</button>
      </div>
    </div>

    <!-- Hoja de plan de tratamiento (imprimible) -->
    <article class="hoja" aria-labelledby="hoja-titulo">
      <header class="hoja__cabeza">
        <div>
          <p class="etiqueta">{{ site.nombre }} · {{ site.sufijo }}</p>
          <h3 id="hoja-titulo" class="hoja__titulo">Plan de tratamiento</h3>
        </div>
        <p class="etiqueta hoja__folio">Folio {{ folio }}<br>{{ hoy }}</p>
      </header>

      <div v-if="!plan.lineas.length" class="hoja__vacia">
        <p>Elige tratamientos a la izquierda y aquí aparece tu hoja, con las piezas marcadas.</p>
      </div>

      <template v-else>
        <SvgArcadaSvg class="hoja__arcada" :marcadas="todasLasPiezas" numeros :encia="false" titulo="Piezas incluidas en el plan" />

        <table class="hoja__tabla">
          <thead>
            <tr><th scope="col">Tratamiento</th><th scope="col">Piezas</th><th scope="col" class="num">Citas</th><th scope="col" class="num">Importe</th></tr>
          </thead>
          <tbody>
            <tr v-for="l in plan.lineas" :key="l.slug" :class="{ 'is-pendiente': l.pendiente }">
              <td><span class="mono hoja__cod">{{ l.codigo }}</span> {{ l.nombre }}</td>
              <td class="mono">
                <template v-if="l.pendiente">elige piezas</template>
                <template v-else>{{ l.piezas.length ? l.piezas.join(' · ') : '—' }}</template>
              </td>
              <td class="num mono">{{ l.citas || '—' }}</td>
              <td class="num mono">{{ l.pendiente ? '—' : pesos(l.subtotal) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colspan="2">Total estimado</th>
              <td class="num mono">{{ plan.citas }}</td>
              <td class="num mono hoja__total">{{ pesos(plan.total) }}</td>
            </tr>
          </tfoot>
        </table>
        <p v-if="plan.incompleto" class="hoja__alerta">Falta elegir piezas en algún tratamiento.</p>
        <p class="hoja__aviso">Precios ilustrativos "desde", sujetos a valoración. Las citas son aproximadas. Documento de demostración.</p>

        <div class="hoja__acciones">
          <button type="button" class="boton boton--coral" @click="enviar(mensaje(), 'Vista previa: tu plan por WhatsApp')">Enviar por WhatsApp</button>
          <button type="button" class="boton boton--claro" @click="imprimir">Imprimir</button>
          <NuxtLink :to="{ path: '/cita', query: consultaPlan }" class="enlace">Agendar con este plan</NuxtLink>
        </div>
      </template>
    </article>
  </div>
</template>

<style scoped>
.plan {
  display: grid;
  gap: 2.5rem;
}

.plan__paso {
  color: var(--color-coral-oscuro);
  margin-bottom: 0.75rem;
}

.plan__opciones {
  border-top: 1.5px solid var(--color-tinta);
}

.opcion {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--color-tinta);
}

.opcion__label {
  flex: 1;
  display: grid;
  grid-template-columns: 1.5rem 1fr auto;
  align-items: center;
  gap: 0.75rem;
  min-height: 3.25rem;
  cursor: pointer;
}

.opcion__check {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

/* Casilla dibujada: un cuadro de expediente que se rellena con una marca. */
.opcion__caja {
  width: 1.3rem;
  height: 1.3rem;
  border: 1.5px solid var(--color-tinta);
  background: var(--color-marfil);
  position: relative;
}

.opcion.is-elegida .opcion__caja {
  background: var(--color-coral);
}

.opcion.is-elegida .opcion__caja::after {
  content: "";
  position: absolute;
  left: 0.32rem;
  top: 0.08rem;
  width: 0.4rem;
  height: 0.75rem;
  border: solid var(--color-tinta);
  border-width: 0 2px 2px 0;
  rotate: 40deg;
}

.opcion__check:focus-visible + .opcion__caja {
  outline: 2.5px solid var(--color-coral-oscuro);
  outline-offset: 3px;
}

.opcion__nombre {
  font-size: 1.05rem;
}

.opcion__precio {
  font-size: 0.85rem;
}

.opcion__precio small {
  color: var(--color-tinta-suave);
}

.opcion__piezas {
  min-height: 2.75rem;
  padding: 0 0.7rem;
  border: 1.5px solid var(--color-tinta);
  border-radius: 1px 1px 12px 12px;
  background: var(--color-menta);
  white-space: nowrap;
}

.opcion__piezas[aria-pressed="true"] {
  background: var(--color-tinta);
  color: var(--color-marfil);
}

.plan__odonto {
  margin-top: 2rem;
  padding: 1.25rem;
  border: 1.5px dashed var(--color-tinta);
  background: var(--color-marfil);
}

.plan__ayuda {
  font-size: var(--text-chico);
  color: var(--color-tinta-suave);
  margin-bottom: 1rem;
}

.plan__listo {
  margin-top: 1rem;
}

/* Hoja */
.hoja {
  align-self: start;
  padding: clamp(1.25rem, 3vw, 2rem);
  background: #FBF6EC;
  border: 1.5px solid var(--color-tinta);
  border-radius: var(--radius-recto);
  box-shadow: var(--shadow-carton);
}

.hoja__cabeza {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 3px double var(--color-tinta);
}

.hoja__titulo {
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  margin-top: 0.3rem;
}

.hoja__folio {
  text-align: right;
  color: var(--color-tinta-suave);
}

.hoja__vacia {
  padding: 3rem 0 1rem;
  color: var(--color-tinta-suave);
  max-width: 34ch;
}

.hoja__arcada {
  max-width: 15rem;
  margin: 1.25rem auto 0.5rem;
}

.hoja__tabla {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.92rem;
}

.hoja__tabla th,
.hoja__tabla td {
  padding: 0.55rem 0.3rem;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px dotted var(--color-arena-oscura);
}

.hoja__tabla thead th {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-tinta-suave);
  border-bottom: 1.5px solid var(--color-tinta);
}

.hoja__tabla .num {
  text-align: right;
  white-space: nowrap;
}

.hoja__tabla td.mono {
  font-size: 0.8rem;
}

.hoja__cod {
  font-size: 0.7rem;
  color: var(--color-coral-oscuro);
}

.hoja__tabla tr.is-pendiente td {
  color: var(--color-coral-oscuro);
}

.hoja__tabla tfoot th,
.hoja__tabla tfoot td {
  border-bottom: 0;
  border-top: 1.5px solid var(--color-tinta);
  font-weight: 700;
  padding-top: 0.8rem;
}

.hoja__total {
  font-size: 1.15rem !important;
}

.hoja__alerta {
  margin-top: 0.6rem;
  color: var(--color-coral-oscuro);
  font-weight: 700;
  font-size: var(--text-chico);
}

.hoja__aviso {
  margin-top: 0.8rem;
  font-size: 0.8rem;
  color: var(--color-tinta-suave);
}

.hoja__acciones {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem 1.2rem;
  margin-top: 1.25rem;
}

@media (min-width: 64rem) {
  .plan {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: clamp(2.5rem, 5vw, 4.5rem);
    align-items: start;
  }

  .hoja {
    position: sticky;
    top: 1.5rem;
  }
}

/* Impresión: solo la hoja. */
@media print {
  .plan__armar,
  .hoja__acciones {
    display: none !important;
  }

  .plan {
    display: block;
  }

  .hoja {
    position: static;
    box-shadow: none;
    border: 0;
    padding: 0;
    background: #fff;
  }

  .hoja__arcada {
    max-width: 9cm;
  }
}
</style>
