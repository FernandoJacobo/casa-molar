<script setup lang="ts">
/**
 * Radiografía panorámica estilizada: mandíbula, senos y 32 piezas con raíces en trazo claro.
 * La pieza 46 lleva un implante (para la anotación de "planeación digital").
 * Los marcadores 1–3 señalan lo que explican las anotaciones de la sección.
 */
import type { TipoPieza } from '~/data/tratamientos'
import { dienteFrontal } from '~/utils/dientesFrontales'

const TIPOS: TipoPieza[] = ['incisivo', 'incisivo', 'canino', 'premolar', 'premolar', 'molar', 'molar', 'cordal']
const ANCHO_SUP = [38, 30, 32, 30, 29, 44, 41, 37]
const ANCHO_INF = [26, 28, 31, 30, 31, 46, 43, 40]

const CENTRO = 450
const plano = (x: number) => 176 + 34 * ((x - CENTRO) / 330) ** 2

interface Colocada { fdi: number; x: number; w: number; tipo: TipoPieza; y: number; giro: number }

function fila(anchos: number[], superior: boolean): Colocada[] {
  const res: Colocada[] = []
  for (const lado of [-1, 1]) {
    let x = CENTRO
    anchos.forEach((w, i) => {
      const cx = x + (lado * w) / 2
      x += lado * (w + 2)
      const cuadrante = superior ? (lado === -1 ? 1 : 2) : (lado === -1 ? 4 : 3)
      const pendiente = (2 * 34 * (cx - CENTRO)) / 330 ** 2
      res.push({ fdi: cuadrante * 10 + i + 1, x: cx, w, tipo: TIPOS[i]!, y: plano(cx), giro: (Math.atan(pendiente) * 180) / Math.PI })
    })
  }
  return res
}

const superiores = fila(ANCHO_SUP, true)
const inferiores = fila(ANCHO_INF, false)

const altoCorona = (t: TipoPieza) => (t === 'incisivo' ? 44 : t === 'canino' ? 46 : t === 'premolar' ? 38 : 34)
const altoRaiz = (t: TipoPieza) => (t === 'canino' ? 62 : t === 'incisivo' ? 58 : t === 'premolar' ? 56 : 48)

function piezaSup(p: Colocada) {
  const hc = altoCorona(p.tipo)
  return { d: dienteFrontal(p.tipo, p.w, hc, altoRaiz(p.tipo)), t: `rotate(${p.giro.toFixed(2)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}) translate(${p.x.toFixed(1)} ${(p.y - 3 - hc).toFixed(1)})` }
}
function piezaInf(p: Colocada) {
  const hc = altoCorona(p.tipo) - 4
  return { d: dienteFrontal(p.tipo, p.w, hc, altoRaiz(p.tipo) + 4), t: `rotate(${-p.giro.toFixed(2)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}) translate(${p.x.toFixed(1)} ${(p.y + 3 + hc).toFixed(1)}) scale(1 -1)` }
}

const implante = inferiores.find(p => p.fdi === 46)!
const resto = inferiores.filter(p => p.fdi !== 46)
const coronaImplante = dienteFrontal('molar', implante.w, altoCorona('molar') - 4, 0)

defineExpose({ implante })
</script>

<template>
  <svg class="pano" viewBox="0 0 900 400" role="img" aria-label="Radiografía panorámica ilustrada: las 32 piezas con sus raíces y un implante en un molar inferior.">
    <g class="pano__hueso">
      <!-- Mandíbula y ramas -->
      <path d="M70,58 C64,140 74,230 112,300 C160,368 300,392 450,392 C600,392 740,368 788,300 C826,230 836,140 830,58" />
      <path d="M116,70 C108,150 120,210 156,262 M784,70 C792,150 780,210 744,262" />
      <path d="M70,58 C86,40 104,36 120,44 M830,58 C814,40 796,36 780,44" />
      <!-- Senos maxilares y piso nasal -->
      <path d="M170,96 C190,46 300,40 360,74 C350,96 260,104 170,96 Z" />
      <path d="M730,96 C710,46 600,40 540,74 C550,96 640,104 730,96 Z" />
      <path d="M372,52 C410,38 490,38 528,52 M450,20 L450,48" />
      <!-- Conducto mandibular -->
      <path class="pano__conducto" d="M140,280 C220,320 330,336 450,338 C570,336 680,320 760,280" />
    </g>

    <g class="pano__piezas">
      <g v-for="p in superiores" :key="p.fdi" :transform="piezaSup(p).t">
        <path class="pano__contorno" :d="piezaSup(p).d.contorno" />
        <path class="pano__esmalte" :d="piezaSup(p).d.corona" />
        <path class="pano__pulpa" :d="piezaSup(p).d.pulpa" />
      </g>
      <g v-for="p in resto" :key="p.fdi" :transform="piezaInf(p).t">
        <path class="pano__contorno" :d="piezaInf(p).d.contorno" />
        <path class="pano__esmalte" :d="piezaInf(p).d.corona" />
        <path class="pano__pulpa" :d="piezaInf(p).d.pulpa" />
      </g>
      <!-- Implante en la 46: corona + tornillo -->
      <g :transform="piezaInf(implante).t" class="pano__implante">
        <path class="pano__esmalte pano__esmalte--brillante" :d="coronaImplante.corona" />
        <path class="pano__contorno" :d="coronaImplante.corona" />
        <path d="M-9,-2 L9,-2 L7,-46 Q0,-54 -7,-46 Z" class="pano__tornillo" />
        <path d="M-9,-10 L9,-6 M-8.6,-18 L8.6,-14 M-8.2,-26 L8.2,-22 M-7.8,-34 L7.8,-30 M-7.4,-42 L7.4,-38" class="pano__rosca" />
      </g>
    </g>

    <!-- Marcadores de las anotaciones -->
    <g class="pano__marcas">
      <g transform="translate(450 112)"><circle r="13" /><text>1</text></g>
      <g transform="translate(610 200)"><circle r="13" /><text>2</text></g>
      <g :transform="`translate(${implante.x} ${implante.y + 116})`"><circle r="13" /><text>3</text></g>
    </g>
  </svg>
</template>

<style scoped>
.pano {
  display: block;
  width: 100%;
  height: auto;
}

.pano__hueso path {
  fill: none;
  stroke: var(--color-placa-linea);
  stroke-width: 1.4;
  stroke-opacity: 0.5;
  stroke-linecap: round;
}

.pano__conducto {
  stroke-dasharray: 6 6;
  stroke-opacity: 0.3 !important;
}

.pano__piezas {
}

.pano__contorno {
  fill: rgb(143 196 208 / 0.13);
  stroke: var(--color-placa-linea);
  stroke-width: 1.3;
  stroke-linejoin: round;
}

.pano__esmalte {
  fill: rgb(207 227 232 / 0.32);
}

.pano__esmalte--brillante {
  fill: rgb(207 227 232 / 0.8);
}

.pano__pulpa {
  fill: none;
  stroke: var(--color-placa-linea);
  stroke-width: 1;
  stroke-opacity: 0.45;
}

.pano__tornillo {
  fill: rgb(207 227 232 / 0.85);
  stroke: var(--color-placa-texto);
  stroke-width: 1.2;
}

.pano__rosca {
  fill: none;
  stroke: var(--color-placa);
  stroke-width: 1.4;
}

.pano__marcas circle {
  fill: var(--color-placa-linea);
  stroke: var(--color-placa);
  stroke-width: 2;
}

.pano__marcas text {
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 14px;
  fill: var(--color-placa);
  text-anchor: middle;
  dominant-baseline: central;
}
</style>
