<script setup lang="ts">
/**
 * Odontograma interactivo: 32 piezas en dos arcadas, numeración FDI.
 *
 * - Mouse/touch: tocar una pieza la selecciona.
 * - Teclado: Tab entra y sale (un solo punto de tabulación, "roving tabindex"); flechas ←/→ recorren
 *   la arcada, ↑/↓ cambian de arcada, Inicio/Fin van a los extremos y Enter/Espacio seleccionan.
 * - Lector de pantalla: cada pieza es un botón con su nombre; además hay una lista alternativa
 *   oculta visualmente (se muestra al recibir el foco).
 * - Móvil: pestañas Superior/Inferior que hacen zoom a una arcada.
 *
 * `multiple`: modo de selección de varias piezas (plan de tratamiento), con v-model.
 */
import { piezas, piezaPorFdi, ordenVisual, type Pieza } from '~/data/piezas'
import { disposicionArcadas, posicionEtiqueta, transformarPieza, trazoCurva, type PiezaColocada } from '~/utils/arcada'

const props = withDefaults(defineProps<{
  multiple?: boolean
  /** Piezas habilitadas (modo múltiple); el resto se ve tenue y no se puede elegir. */
  habilitadas?: number[] | null
  etiqueta?: string
}>(), { multiple: false, habilitadas: null, etiqueta: 'Odontograma: elige una pieza' })

const seleccion = defineModel<number[]>({ default: () => [] })
const activa = defineModel<number | null>('activa', { default: null })

const d = disposicionArcadas()
const ordenSup = ordenVisual('superior')
const ordenInf = ordenVisual('inferior')

const esMovil = useMediaQuery('(max-width: 47.99rem)')
const vista = ref<'superior' | 'inferior'>('superior')

const viewBox = computed(() => {
  const x = -d.semiancho
  const w = d.semiancho * 2
  if (!esMovil.value) return `${x} 0 ${w} ${d.alto}`
  return vista.value === 'superior' ? `${x} 0 ${w} ${d.altoSup}` : `${x} ${d.altoSup - 4} ${w} ${d.alto - d.altoSup + 4}`
})

/** Pieza que tiene el punto de tabulación. */
const foco = ref<number>(11)
const refs = new Map<number, SVGGElement>()
const registrar = (fdi: number) => (el: unknown) => {
  if (el) refs.set(fdi, el as SVGGElement)
  else refs.delete(fdi)
}

const habilitada = (fdi: number) => !props.multiple || !props.habilitadas || props.habilitadas.includes(fdi)
const marcada = (fdi: number) => (props.multiple ? seleccion.value.includes(fdi) : activa.value === fdi)

function vibrar() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(8)
}

function elegir(fdi: number) {
  if (!habilitada(fdi)) return
  foco.value = fdi
  vibrar()
  if (props.multiple) {
    seleccion.value = seleccion.value.includes(fdi) ? seleccion.value.filter(f => f !== fdi) : [...seleccion.value, fdi]
  }
  else {
    activa.value = activa.value === fdi ? null : fdi
  }
}

function enfocar(fdi: number) {
  foco.value = fdi
  const p = piezaPorFdi(fdi)
  if (p && esMovil.value) vista.value = p.arcada
  nextTick(() => refs.get(fdi)?.focus())
}

function alTeclear(e: KeyboardEvent, fdi: number) {
  const p = piezaPorFdi(fdi)!
  const orden = p.arcada === 'superior' ? ordenSup : ordenInf
  const otro = p.arcada === 'superior' ? ordenInf : ordenSup
  const i = orden.indexOf(fdi)
  let destino: number | undefined
  switch (e.key) {
    case 'ArrowRight': destino = orden[Math.min(i + 1, orden.length - 1)]; break
    case 'ArrowLeft': destino = orden[Math.max(i - 1, 0)]; break
    case 'ArrowUp':
    case 'ArrowDown': destino = otro[i]; break
    case 'Home': destino = orden[0]; break
    case 'End': destino = orden[orden.length - 1]; break
    case 'Enter':
    case ' ':
      e.preventDefault()
      elegir(fdi)
      return
    default: return
  }
  e.preventDefault()
  if (destino !== undefined) enfocar(destino)
}

function etiquetaAria(p: Pieza) {
  const estado = props.multiple ? (habilitada(p.fdi) ? '' : ' (no aplica)') : ''
  return `${p.fdi}: ${p.nombre}${estado}`
}

const colocadas = computed(() => [
  ...d.sup.piezas.map(c => ({ c, inferior: false })),
  ...d.inf.piezas.map(c => ({ c, inferior: true })),
])

const transformarEnLienzo = (c: PiezaColocada, inferior: boolean) =>
  inferior ? `translate(0 ${d.origenInf}) scale(1 -1) ${transformarPieza(c)}` : `translate(0 ${d.origenSup}) ${transformarPieza(c)}`

const curvaSup = `translate(0 ${d.origenSup})`
const curvaInf = `translate(0 ${d.origenInf}) scale(1 -1)`
const encias = { sup: trazoCurva(d.sup, 0.5), inf: trazoCurva(d.inf, 0.5) }
const etiquetaPos = (c: PiezaColocada, inferior: boolean) => posicionEtiqueta(d, c, inferior)

const listaPorArcada = computed(() => [
  { titulo: 'Arcada superior', piezas: ordenSup.map(f => piezaPorFdi(f)!) },
  { titulo: 'Arcada inferior', piezas: ordenInf.map(f => piezaPorFdi(f)!) },
])

defineExpose({ enfocar })
</script>

<template>
  <div class="odonto" :class="{ 'odonto--multiple': multiple }">
    <div class="odonto__pestanas" role="group" aria-label="Arcada">
      <button type="button" class="odonto__pestana" :aria-pressed="vista === 'superior'" @click="vista = 'superior'">Superior</button>
      <button type="button" class="odonto__pestana" :aria-pressed="vista === 'inferior'" @click="vista = 'inferior'">Inferior</button>
    </div>

    <svg class="odonto__svg" :viewBox="viewBox" role="group" :aria-label="etiqueta">
      <g aria-hidden="true">
        <path class="odonto__encia" :transform="curvaSup" :d="encias.sup" />
        <path class="odonto__encia" :transform="curvaInf" :d="encias.inf" />
        <path class="odonto__eje" :d="`M0,${d.origenSup - 6} L0,${d.alto - 4}`" />
        <text class="odonto__lado" :x="-d.semiancho + 2" :y="d.altoSup - 2">DER.</text>
        <text class="odonto__lado odonto__lado--fin" :x="d.semiancho - 2" :y="d.altoSup - 2">IZQ.</text>
      </g>

      <g
        v-for="{ c, inferior } in colocadas"
        :key="c.fdi"
        :ref="registrar(c.fdi)"
        class="odonto__pieza"
        :class="{ 'is-marcada': marcada(c.fdi), 'is-off': !habilitada(c.fdi) }"
        role="button"
        :tabindex="foco === c.fdi ? 0 : -1"
        :aria-pressed="marcada(c.fdi)"
        :aria-disabled="habilitada(c.fdi) ? undefined : 'true'"
        :aria-label="etiquetaAria(piezaPorFdi(c.fdi)!)"
        @click="elegir(c.fdi)"
        @keydown="alTeclear($event, c.fdi)"
        @focus="foco = c.fdi"
      >
        <g :transform="transformarEnLienzo(c, inferior)">
          <g class="odonto__eleva">
            <rect class="odonto__area" x="-6" y="-7" width="12" height="14" />
            <use :href="`#pz-${c.tipo}`" />
          </g>
        </g>
        <text class="odonto__num" v-bind="etiquetaPos(c, inferior)" aria-hidden="true">{{ c.fdi }}</text>
      </g>
    </svg>

    <!-- Lista alternativa para lector de pantalla (se muestra si recibe el foco). -->
    <div class="odonto__lista">
      <div v-for="grupo in listaPorArcada" :key="grupo.titulo">
        <p>{{ grupo.titulo }}</p>
        <ul>
          <li v-for="p in grupo.piezas" :key="p.fdi">
            <button type="button" :aria-pressed="marcada(p.fdi)" :disabled="!habilitada(p.fdi)" @click="elegir(p.fdi)">
              {{ p.fdi }} · {{ p.nombre }}
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.odonto {
  position: relative;
}

.odonto__pestanas {
  display: none;
  gap: 0;
  margin-bottom: 0.75rem;
}

.odonto__pestana {
  flex: 1;
  min-height: 2.75rem;
  border: 1.5px solid var(--color-tinta);
  background: var(--color-marfil);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.odonto__pestana + .odonto__pestana {
  border-left: 0;
}

.odonto__pestana[aria-pressed="true"] {
  background: var(--color-tinta);
  color: var(--color-marfil);
}

.odonto__svg {
  display: block;
  width: 100%;
  height: auto;
  touch-action: manipulation;
}

.odonto__encia {
  fill: none;
  stroke: var(--color-coral);
  stroke-opacity: 0.14;
  stroke-width: 13;
}

.odonto__eje {
  stroke: var(--color-arena-oscura);
  stroke-width: 0.3;
  stroke-dasharray: 1.2 1.6;
}

.odonto__lado {
  font-family: var(--font-mono);
  font-size: 2.6px;
  letter-spacing: 0.1em;
  fill: var(--color-tinta-suave);
}

.odonto__lado--fin {
  text-anchor: end;
}

.odonto__pieza {
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  --pz-relleno: var(--color-marfil);
}

.odonto__area {
  fill: transparent;
}

.odonto__eleva {
  transition: transform 0.22s var(--ease-suave);
}

.odonto__pieza:hover {
  --pz-relleno: var(--color-hueso);
}

.odonto__pieza:hover .odonto__eleva,
.odonto__pieza:focus-visible .odonto__eleva,
.odonto__pieza.is-marcada .odonto__eleva {
  transform: translateY(-1.8px);
}

.odonto__pieza.is-marcada {
  --pz-relleno: var(--color-menta);
  --pz-grosor: 2px;
}

.odonto__pieza:focus-visible {
  --pz-trazo: var(--color-coral-oscuro);
  --pz-grosor: 2.4px;
}

.odonto__pieza:active .odonto__eleva {
  transform: translateY(-0.6px);
}

.odonto__pieza.is-off {
  cursor: not-allowed;
  opacity: 0.32;
}

.odonto__pieza.is-off .odonto__eleva {
  transform: none !important;
}

.odonto__num {
  font-family: var(--font-mono);
  font-size: 3px;
  fill: var(--color-tinta-suave);
  text-anchor: middle;
  dominant-baseline: middle;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}

.odonto__pieza.is-marcada .odonto__num,
.odonto__pieza:focus-visible .odonto__num {
  fill: var(--color-coral-oscuro);
  font-weight: 700;
}

.odonto__lista {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.odonto__lista:focus-within {
  position: static;
  width: auto;
  height: auto;
  clip: auto;
  white-space: normal;
  margin-top: 1rem;
  padding: 1rem;
  border: 1.5px dashed var(--color-tinta);
  display: grid;
  gap: 1rem;
}

.odonto__lista p {
  font-family: var(--font-mono);
  font-size: var(--text-etiqueta);
  text-transform: uppercase;
}

.odonto__lista ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.odonto__lista button {
  min-height: 2.75rem;
  padding: 0.25rem 0.6rem;
  border: 1px solid var(--color-tinta);
  background: var(--color-marfil);
  font-size: 0.85rem;
}

.odonto__lista button[aria-pressed="true"] {
  background: var(--color-menta);
}

@media (max-width: 47.99rem) {
  .odonto__pestanas {
    display: flex;
  }

  .odonto__num {
    font-size: 3.6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .odonto__eleva {
    transition: none;
  }

  .odonto__pieza:hover .odonto__eleva,
  .odonto__pieza:focus-visible .odonto__eleva,
  .odonto__pieza.is-marcada .odonto__eleva {
    transform: none;
  }
}
</style>
