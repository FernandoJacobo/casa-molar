<script setup lang="ts">
/**
 * Ilustración de cada tratamiento: piezas frontales (con raíz) + el objeto del tratamiento.
 * Línea en tinta, coral como único acento.
 */
import { dienteFrontal } from '~/utils/dientesFrontales'

const props = defineProps<{ slug: string; titulo?: string }>()

const incisivo = dienteFrontal('incisivo', 58, 74, 92)
const incisivoChico = dienteFrontal('incisivo', 40, 60, 70)
const molar = dienteFrontal('molar', 92, 62, 84)
const canino = dienteFrontal('canino', 42, 64, 74)
const deLeche = dienteFrontal('molar', 64, 46, 40)

/** Tres piezas de enfrente vistas de frente (alineadores y brackets). */
const fila = [
  { x: 72, d: incisivoChico },
  { x: 120, d: dienteFrontal('incisivo', 50, 70, 70) },
  { x: 168, d: incisivoChico },
]

const s = computed(() => props.slug)
</script>

<template>
  <svg class="ilus" viewBox="0 0 240 240" :role="titulo ? 'img' : undefined" :aria-label="titulo || undefined" :aria-hidden="titulo ? undefined : 'true'" focusable="false">
    <g class="ilus__trazo">
      <!-- Limpieza: incisivo + punta de ultrasonido y rocío -->
      <template v-if="s === 'limpieza'">
        <path class="ilus__encia" d="M30,118 Q120,104 210,118 L210,96 Q120,84 30,96 Z" />
        <g transform="translate(110 112) scale(1 -1)">
          <path class="ilus__pieza" :d="incisivo.contorno" />
          <path class="ilus__fino" :d="incisivo.cuello" />
        </g>
        <path class="ilus__sarro" d="M86,92 Q94,88 98,94 Q104,88 112,92 Q120,87 130,92" />
        <path class="ilus__objeto" d="M226,44 L174,80 L142,86" />
        <path class="ilus__objeto ilus__objeto--grueso" d="M238,36 L198,64" />
        <g class="ilus__rocio">
          <circle cx="140" cy="76" r="2" /><circle cx="148" cy="70" r="1.6" /><circle cx="136" cy="68" r="1.4" /><circle cx="154" cy="78" r="1.2" />
        </g>
      </template>

      <!-- Resinas: molar con la restauración en coral y la lámpara -->
      <template v-else-if="s === 'resinas'">
        <path class="ilus__encia" d="M20,128 Q120,116 220,128 L220,150 Q120,140 20,150 Z" />
        <g transform="translate(116 66)">
          <path class="ilus__pieza" :d="molar.contorno" transform="translate(0 62) scale(1 -1)" />
          <path class="ilus__resina" d="M-22,8 C-14,22 14,24 24,8 C14,16 -12,16 -22,8 Z" />
          <path class="ilus__fino" d="M-30,2 Q0,14 30,2" />
        </g>
        <path class="ilus__objeto ilus__objeto--grueso" d="M226,30 L170,48" />
        <path class="ilus__objeto" d="M170,48 Q156,52 152,62" />
        <path class="ilus__luz" d="M148,66 L134,74 M150,70 L142,84 M146,64 L130,64" />
      </template>

      <!-- Blanqueamiento: dos incisivos (antes/después) y una muestra de tono -->
      <template v-else-if="s === 'blanqueamiento'">
        <path class="ilus__encia" d="M14,92 Q100,80 186,92 L186,70 Q100,60 14,70 Z" />
        <g transform="translate(64 84) scale(1 -1)"><path class="ilus__pieza ilus__pieza--oscura" :d="dienteFrontal('incisivo', 52, 74, 60).contorno" /></g>
        <g transform="translate(130 84) scale(1 -1)"><path class="ilus__pieza ilus__pieza--clara" :d="dienteFrontal('incisivo', 52, 74, 60).contorno" /></g>
        <path class="ilus__flecha" d="M78,186 Q98,198 118,186 M112,182 L118,186 L112,191" />
        <g transform="translate(200 120)">
          <rect x="-9" y="-30" width="18" height="16" class="ilus__soporte" />
          <path class="ilus__muestra" d="M-15,-14 L15,-14 L15,22 Q15,38 0,38 Q-15,38 -15,22 Z" />
          <text y="12" class="ilus__codigo">B1</text>
        </g>
      </template>

      <!-- Alineadores: tres piezas con la guarda transparente encima -->
      <template v-else-if="s === 'alineadores'">
        <path class="ilus__encia" d="M30,86 Q120,74 210,86 L210,64 Q120,54 30,64 Z" />
        <g v-for="(p, i) in fila" :key="i" :transform="`translate(${p.x} ${84 + (i === 1 ? 0 : 4)}) scale(1 -1)`">
          <path class="ilus__pieza" :d="p.d.corona" />
        </g>
        <path class="ilus__guarda" d="M44,90 L44,150 Q46,166 72,168 Q96,166 98,154 Q120,168 142,154 Q144,166 168,168 Q194,166 196,150 L196,90" />
        <text x="120" y="210" class="ilus__nota">guarda transparente</text>
      </template>

      <!-- Brackets: piezas, brackets y arco -->
      <template v-else-if="s === 'brackets'">
        <path class="ilus__encia" d="M30,86 Q120,74 210,86 L210,64 Q120,54 30,64 Z" />
        <g v-for="(p, i) in fila" :key="i" :transform="`translate(${p.x} ${84 + (i === 1 ? -2 : 6)}) rotate(${i === 0 ? 6 : i === 2 ? -5 : 0}) scale(1 -1)`">
          <path class="ilus__pieza" :d="p.d.corona" />
        </g>
        <g class="ilus__bracket">
          <rect x="62" y="120" width="20" height="16" /><rect x="110" y="114" width="20" height="16" /><rect x="158" y="120" width="20" height="16" />
        </g>
        <path class="ilus__arco" d="M24,134 C70,124 170,118 216,132" />
      </template>

      <!-- Implante: corona sobre tornillo, en la encía -->
      <template v-else-if="s === 'implantes'">
        <path class="ilus__hueso" d="M28,124 L212,124 L212,226 L28,226" />
        <path class="ilus__encia" d="M20,124 Q120,112 220,124 L220,104 Q120,94 20,104 Z" />
        <g transform="translate(120 106)">
          <path class="ilus__pieza" :d="dienteFrontal('molar', 82, 60, 0).corona" transform="scale(1 -1)" />
          <path class="ilus__resina" d="M-12,0 L12,0 L12,10 L-12,10 Z" />
          <path class="ilus__tornillo" d="M-17,10 L17,10 L14,96 Q0,110 -14,96 Z" />
          <path class="ilus__fino" d="M-17,24 L17,18 M-16,38 L16,32 M-15.5,52 L15.5,46 M-15,66 L15,60 M-14.5,80 L14.5,74" />
        </g>
      </template>

      <!-- Carillas: incisivo y la lámina delante -->
      <template v-else-if="s === 'carillas'">
        <path class="ilus__encia" d="M20,96 Q110,84 200,96 L200,74 Q110,64 20,74 Z" />
        <g transform="translate(96 94) scale(1 -1)">
          <path class="ilus__pieza" :d="incisivo.contorno" />
        </g>
        <g transform="translate(162 100) scale(1 -1)">
          <path class="ilus__lamina" :d="dienteFrontal('incisivo', 54, 72, 0).corona" />
        </g>
        <path class="ilus__flecha" d="M140,200 Q120,212 104,198 M110,196 L104,198 L106,204" />
        <text x="162" y="226" class="ilus__nota">0.5 mm</text>
      </template>

      <!-- Endodoncia: molar con los conductos en coral y una lima -->
      <template v-else-if="s === 'endodoncia'">
        <path class="ilus__encia" d="M20,106 Q120,94 220,106 L220,84 Q120,74 20,84 Z" />
        <g transform="translate(120 102)">
          <g transform="scale(1 -1)">
            <path class="ilus__pieza" :d="molar.contorno" />
          </g>
          <path class="ilus__conducto" :d="molar.pulpa" transform="scale(1 -1)" />
        </g>
        <path class="ilus__objeto" d="M168,12 L136,128" />
        <path class="ilus__objeto ilus__objeto--grueso" d="M176,0 L166,22" />
      </template>

      <!-- Odontopediatría: pieza de leche y cepillo chico -->
      <template v-else>
        <path class="ilus__encia" d="M30,110 Q110,100 190,110 L190,90 Q110,82 30,90 Z" />
        <g transform="translate(96 106) scale(1 -1)">
          <path class="ilus__pieza" :d="deLeche.contorno" />
        </g>
        <path class="ilus__fino" d="M76,80 Q81,84 86,80 M106,80 Q111,84 116,80 M88,92 Q96,99 104,92" />
        <g transform="translate(178 150) rotate(-38)">
          <rect x="-6" y="-8" width="12" height="80" rx="6" class="ilus__mango" />
          <rect x="-8" y="-34" width="16" height="26" rx="2" class="ilus__cabeza" />
          <path class="ilus__fino" d="M-8,-28 L-16,-28 M-8,-22 L-16,-22 M-8,-16 L-16,-16 M-8,-10 L-16,-10" />
        </g>
      </template>
    </g>
  </svg>
</template>

<style scoped>
.ilus {
  display: block;
  width: 100%;
  height: auto;
}

.ilus__trazo {
  filter: url(#trazo);
}

.ilus__trazo path,
.ilus__trazo rect {
  stroke: var(--color-tinta);
  stroke-width: 1.8;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.ilus__pieza {
  fill: var(--color-marfil);
}

.ilus__pieza--oscura {
  fill: #D4B685;
}

.ilus__pieza--clara {
  fill: #F2EBDD;
}

.ilus__encia {
  fill: var(--color-coral);
  stroke: none !important;
  opacity: 0.85;
}

.ilus__hueso {
  fill: var(--color-hueso);
  stroke-dasharray: 2 5;
}

.ilus__fino {
  fill: none;
  stroke-width: 1.2 !important;
  opacity: 0.7;
}

.ilus__sarro {
  fill: none;
  stroke: var(--color-arena-oscura) !important;
  stroke-width: 4 !important;
}

.ilus__objeto {
  fill: none;
  stroke-width: 2.4 !important;
}

.ilus__objeto--grueso {
  stroke-width: 9 !important;
}

.ilus__rocio circle {
  fill: var(--color-tinta);
}

.ilus__resina {
  fill: var(--color-coral);
}

.ilus__luz {
  fill: none;
  stroke: var(--color-coral) !important;
  stroke-width: 2 !important;
}

.ilus__flecha {
  fill: none;
}

.ilus__soporte {
  fill: var(--color-tinta);
}

.ilus__muestra {
  fill: #F2EBDD;
}

.ilus__codigo,
.ilus__nota {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-anchor: middle;
  fill: var(--color-tinta);
}

.ilus__nota {
  font-weight: 400;
  letter-spacing: 0.06em;
}

.ilus__guarda {
  fill: rgb(191 224 212 / 0.45);
  stroke-dasharray: 5 4;
}

.ilus__bracket rect {
  fill: var(--color-hueso);
}

.ilus__arco {
  fill: none;
  stroke: var(--color-coral) !important;
  stroke-width: 2.6 !important;
}

.ilus__tornillo {
  fill: var(--color-hueso);
}

.ilus__lamina {
  fill: rgb(242 235 221 / 0.75);
  stroke: var(--color-coral) !important;
}

.ilus__conducto {
  fill: none;
  stroke: var(--color-coral) !important;
  stroke-width: 3 !important;
}

.ilus__mango {
  fill: var(--color-menta);
}

.ilus__cabeza {
  fill: var(--color-marfil);
}
</style>
