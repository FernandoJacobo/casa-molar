<script setup lang="ts">
/**
 * Arcada dentaria ilustrada (vista oclusal), construida con las piezas base del sprite a lo largo
 * de la curva de `geometriaArcada`. Estática: el odontograma interactivo vive en `OdontogramaInteractivo`.
 */
import { geometriaArcada, trazoCurva, type PiezaColocada } from '~/utils/arcada'

const props = withDefaults(defineProps<{
  modo?: 'superior' | 'ambas'
  /** Destello único que recorre las piezas al cargar. */
  destello?: boolean
  /** Cuadrante resaltado (cronómetro de cepillado). */
  cuadrante?: number | null
  numeros?: boolean
  encia?: boolean
  /** Título accesible; sin título, la ilustración es decorativa. */
  titulo?: string
}>(), { modo: 'ambas', destello: false, cuadrante: null, numeros: false, encia: true, titulo: '' })

const sup = geometriaArcada('superior')
const inf = geometriaArcada('inferior')

const MARGEN = 7
const SEPARACION = 9
const maxY = (ps: PiezaColocada[]) => Math.max(...ps.map(p => p.y)) + 6
const altoSup = maxY(sup.piezas)
const altoInf = maxY(inf.piezas)
const ancho = Math.max(sup.semiancho, inf.semiancho) * 2 + 16
const origenSup = MARGEN + 4
const origenInf = origenSup + altoSup + SEPARACION + altoInf

const viewBox = computed(() => {
  const alto = props.modo === 'superior' ? origenSup + altoSup + MARGEN : origenInf + MARGEN
  return `${-ancho / 2 - MARGEN} 0 ${ancho + MARGEN * 2} ${alto}`
})

const transformar = (p: PiezaColocada) => `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${p.angulo.toFixed(2)}) scale(${p.escalaX.toFixed(3)} ${p.escalaY.toFixed(3)})`

/** Posición del número FDI: hacia afuera de la pieza, siguiendo la normal. */
function etiqueta(p: PiezaColocada, invertida: boolean) {
  const d = 9.5
  const x = p.x + p.nx * d
  const y = p.y + p.ny * d
  return invertida ? { x, y: origenInf - y } : { x, y: origenSup + y }
}

const cuadranteDe = (fdi: number) => Math.floor(fdi / 10)
const curvaSup = trazoCurva(sup, 0.5)
const curvaInf = trazoCurva(inf, 0.5)
</script>

<template>
  <svg
    class="arcada"
    :class="{ 'arcada--destello': destello }"
    :viewBox="viewBox"
    :role="titulo ? 'img' : undefined"
    :aria-label="titulo || undefined"
    :aria-hidden="titulo ? undefined : 'true'"
    focusable="false"
  >
    <g :transform="`translate(0 ${origenSup})`">
      <path v-if="encia" class="arcada__encia" :d="curvaSup" />
      <use
        v-for="(p, i) in sup.piezas"
        :key="p.fdi"
        :href="`#pz-${p.tipo}`"
        :transform="transformar(p)"
        class="arcada__pieza"
        :class="{ 'is-activa': cuadrante === cuadranteDe(p.fdi) }"
        :style="{ '--i': i }"
      />
    </g>
    <g v-if="modo === 'ambas'" :transform="`translate(0 ${origenInf}) scale(1 -1)`">
      <path v-if="encia" class="arcada__encia" :d="curvaInf" />
      <use
        v-for="(p, i) in inf.piezas"
        :key="p.fdi"
        :href="`#pz-${p.tipo}`"
        :transform="transformar(p)"
        class="arcada__pieza"
        :class="{ 'is-activa': cuadrante === cuadranteDe(p.fdi) }"
        :style="{ '--i': 16 + i }"
      />
    </g>
    <g v-if="numeros" class="arcada__numeros">
      <text v-for="p in sup.piezas" :key="`n${p.fdi}`" v-bind="etiqueta(p, false)">{{ p.fdi }}</text>
      <template v-if="modo === 'ambas'">
        <text v-for="p in inf.piezas" :key="`n${p.fdi}`" v-bind="etiqueta(p, true)">{{ p.fdi }}</text>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.arcada {
  display: block;
  width: 100%;
  height: auto;
}

.arcada__encia {
  fill: none;
  stroke: var(--color-coral);
  stroke-opacity: 0.16;
  stroke-width: 13;
  stroke-linecap: butt;
}

.arcada__pieza {
  --pz-relleno: var(--color-marfil);
  transition: --pz-relleno 0.5s var(--ease-suave);
}

.arcada__pieza.is-activa {
  --pz-relleno: var(--color-menta);
}

.arcada__numeros text {
  font-family: var(--font-mono);
  font-size: 3px;
  fill: var(--color-tinta-suave);
  text-anchor: middle;
  dominant-baseline: middle;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: no-preference) {
  .arcada--destello .arcada__pieza {
    animation: destello 0.9s var(--ease-suave) both;
    animation-delay: calc(0.5s + var(--i) * 45ms);
  }
}

@keyframes destello {
  0%, 100% { --pz-relleno: var(--color-marfil); }
  35% { --pz-relleno: #FFFDF7; }
}
</style>

<style>
@property --pz-relleno {
  syntax: "<color>";
  inherits: true;
  initial-value: #F4ECDD;
}
</style>
