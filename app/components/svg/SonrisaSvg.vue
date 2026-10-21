<script setup lang="ts">
/**
 * Sonrisa frontal ilustrada. El color de las piezas sale de `tono` (con transición suave).
 * - `despues`: piezas alineadas.
 * - `antes`: apiñadas y giradas (para el comparador; es una ilustración, no un caso real).
 * - `linea`: solo trazo, para el footer.
 */
import { dienteFrontal } from '~/utils/dientesFrontales'
import type { TipoPieza } from '~/data/tratamientos'

const props = withDefaults(defineProps<{
  tono?: string
  variante?: 'despues' | 'antes' | 'linea'
  titulo?: string
}>(), { tono: '#EEE3CF', variante: 'despues', titulo: '' })

const id = useId()
const CUELLO_SUP = 94
const CUELLO_INF = 174

interface Pieza { x: number; w: number; borde: number; tipo: TipoPieza; giro: number; dx: number; dy: number }

// Mitad derecha de la pantalla (lado izquierdo del paciente); se refleja para la otra mitad.
const MITAD_SUP: Omit<Pieza, 'x' | 'giro' | 'dx' | 'dy'>[] = [
  { w: 36, borde: 142, tipo: 'incisivo' },
  { w: 28, borde: 137, tipo: 'incisivo' },
  { w: 25, borde: 138, tipo: 'premolar' },
  { w: 21, borde: 131, tipo: 'premolar' },
  { w: 17, borde: 125, tipo: 'premolar' },
  { w: 14, borde: 119, tipo: 'molar' },
]
const MITAD_INF: Omit<Pieza, 'x' | 'giro' | 'dx' | 'dy'>[] = [
  { w: 22, borde: 141, tipo: 'incisivo' },
  { w: 23, borde: 142, tipo: 'incisivo' },
  { w: 24, borde: 141, tipo: 'incisivo' },
  { w: 20, borde: 145, tipo: 'premolar' },
  { w: 17, borde: 149, tipo: 'premolar' },
]

/** Desorden de la versión "antes": giro (°) y desplazamiento por posición, lado A / lado B. */
const DESORDEN: Record<number, [number, number, number][]> = {
  0: [[-2, 1.5, 1], [3, -1, 2]],
  1: [[6, -4, -1], [-7, 5, -2]],
  2: [[-3, 2, 2], [3, 0, 1]],
  3: [[2, 0, 0], [-2, 0, 1]],
}

function fila(mitad: typeof MITAD_SUP, antes: boolean): Pieza[] {
  const res: Pieza[] = []
  for (const lado of [1, -1]) {
    let x = 200
    mitad.forEach((p, i) => {
      const centro = x + (lado * p.w) / 2
      x += lado * p.w
      const d = antes ? DESORDEN[i]?.[lado === 1 ? 0 : 1] : undefined
      res.push({ ...p, x: centro, giro: d?.[0] ?? 0, dx: d?.[1] ?? 0, dy: d?.[2] ?? 0 })
    })
  }
  return res
}

const superiores = computed(() => fila(MITAD_SUP, props.variante === 'antes'))
const inferiores = computed(() => fila(MITAD_INF, props.variante === 'antes'))

const coronaSup = (p: Pieza) => dienteFrontal(p.tipo, p.w - 1.2, p.borde - CUELLO_SUP, 0)
const coronaInf = (p: Pieza) => dienteFrontal(p.tipo, p.w - 1.2, CUELLO_INF - p.borde, 0)

const BOCA = 'M42,106 C108,86 160,80 200,84 C240,80 292,86 358,106 C302,150 252,168 200,168 C148,168 98,150 42,106 Z'
const LABIOS = 'M16,104 C58,64 118,44 166,52 C183,55 191,63 200,63 C209,63 217,55 234,52 C282,44 342,64 384,104 C342,168 282,204 200,204 C118,204 58,168 16,104 Z'
</script>

<template>
  <svg
    class="sonrisa"
    :class="`sonrisa--${variante}`"
    viewBox="0 30 400 190"
    :role="titulo ? 'img' : undefined"
    :aria-label="titulo || undefined"
    :aria-hidden="titulo ? undefined : 'true'"
    focusable="false"
    :style="{ '--tono-pieza': tono }"
  >
    <defs>
      <clipPath :id="`boca-${id}`">
        <path :d="BOCA" />
      </clipPath>
    </defs>

    <path class="sonrisa__labios" :d="LABIOS" />
    <path class="sonrisa__boca" :d="BOCA" />

    <g :clip-path="`url(#boca-${id})`">
      <path class="sonrisa__encia" d="M30,70 L370,70 L370,94 C300,90 250,92 200,96 C150,92 100,90 30,94 Z" />
      <path class="sonrisa__encia" d="M30,190 L370,190 L370,160 C300,156 250,158 200,152 C150,158 100,156 30,160 Z" />
      <g v-for="(p, i) in inferiores" :key="`i${i}`" :transform="`translate(${p.x + p.dx} ${CUELLO_INF + p.dy}) rotate(${-p.giro}) scale(1 -1)`">
        <path class="sonrisa__pieza" :d="coronaInf(p).corona" />
      </g>
      <g v-for="(p, i) in superiores" :key="`s${i}`" :transform="`translate(${p.x + p.dx} ${CUELLO_SUP + p.dy}) rotate(${p.giro})`">
        <path class="sonrisa__pieza" :d="coronaSup(p).corona" />
      </g>
    </g>

    <path class="sonrisa__contorno" :d="LABIOS" />
    <path class="sonrisa__contorno sonrisa__contorno--fino" :d="BOCA" />
  </svg>
</template>

<style scoped>
.sonrisa {
  display: block;
  width: 100%;
  height: auto;
}

.sonrisa__labios {
  fill: #E7C9C2;
}

.sonrisa__boca {
  fill: #3A2327;
}

.sonrisa__encia {
  fill: var(--color-encia-oscura);
}

.sonrisa__pieza {
  fill: var(--tono-pieza);
  stroke: #6B5357;
  stroke-width: 1;
  stroke-linejoin: round;
  transition: fill 0.6s var(--ease-suave);
}

.sonrisa__contorno {
  fill: none;
  stroke: #9C6F6A;
  stroke-width: 1.4;
  stroke-linejoin: round;
}

.sonrisa__contorno--fino {
  stroke-width: 1.4;
}

/* Versión de solo línea (footer). */
.sonrisa--linea .sonrisa__labios,
.sonrisa--linea .sonrisa__boca,
.sonrisa--linea .sonrisa__encia {
  fill: none;
}

.sonrisa--linea .sonrisa__pieza {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.2;
}

.sonrisa--linea .sonrisa__contorno {
  stroke: currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .sonrisa__pieza {
    transition: none;
  }
}
</style>
