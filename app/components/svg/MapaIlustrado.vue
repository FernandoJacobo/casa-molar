<script setup lang="ts">
/** Mapa dibujado a mano con calles ficticias. No es una ubicación real. */
import { site } from '~/config/site'

withDefaults(defineProps<{ compacto?: boolean }>(), { compacto: false })
const m = site.mapa
</script>

<template>
  <svg class="mapa" viewBox="0 0 420 280" role="img" :aria-label="`Mapa ilustrado (ficticio): ${site.nombre} está en ${m.avenida} casi esquina con ${m.calle1}, enfrente del ${m.parque}.`">
    <g class="mapa__trazo">
      <!-- Manzanas -->
      <path class="mapa__manzana" d="M14,14 H128 V96 H14 Z M156,14 H262 V96 H156 Z M290,14 H406 V96 H290 Z" />
      <path class="mapa__manzana" d="M14,182 H128 V266 H14 Z M290,182 H406 V266 H290 Z" />
      <!-- Parque -->
      <path class="mapa__parque" d="M156,182 H262 V266 H156 Z" />
      <g class="mapa__arbol">
        <circle cx="178" cy="204" r="9" /><circle cx="204" cy="198" r="7" /><circle cx="238" cy="210" r="10" />
        <circle cx="186" cy="242" r="8" /><circle cx="226" cy="246" r="9" />
      </g>
      <path class="mapa__senda" d="M156,232 C190,226 206,214 262,222" />
      <!-- Edificio de la clínica -->
      <path class="mapa__clinica" d="M300,108 H352 V160 H300 Z" />
    </g>

    <!-- Avenida (horizontal, ancha) y calles -->
    <g class="mapa__calles">
      <path d="M0,104 H420 M0,174 H420" />
      <path d="M142,0 V104 M142,174 V280 M276,0 V104 M276,174 V280" />
      <path class="mapa__eje" d="M0,139 H420" />
    </g>

    <g class="mapa__textos">
      <text x="20" y="143" class="mapa__calle">{{ m.avenida.toUpperCase() }}</text>
      <text x="142" y="58" class="mapa__calle" transform="rotate(-90 142 58)">{{ m.calle1 }}</text>
      <text x="276" y="58" class="mapa__calle" transform="rotate(-90 276 58)">{{ m.calle2 }}</text>
      <text x="142" y="236" class="mapa__calle" transform="rotate(-90 142 236)">{{ m.calle3 }}</text>
      <text x="209" y="276" class="mapa__parque-texto">{{ m.parque }}</text>
    </g>

    <!-- Parada -->
    <g transform="translate(240 160)" class="mapa__parada">
      <rect x="-6" y="-6" width="12" height="12" />
      <text x="0" y="1">P</text>
    </g>

    <!-- Aquí estamos -->
    <g transform="translate(326 128)" class="mapa__aqui">
      <circle r="16" class="mapa__aqui-halo" />
      <use href="#pz-molar" transform="scale(1.35)" />
    </g>
    <g v-if="!compacto" class="mapa__nota">
      <path d="M346,116 C366,96 372,74 362,52" />
      <path d="M357,58 L362,51 L367,59" />
      <text x="330" y="44">Aquí estamos</text>
    </g>

    <!-- Norte -->
    <g transform="translate(398 254)" class="mapa__norte">
      <path d="M0,-14 L5,4 L0,0 L-5,4 Z" />
      <text y="-18">N</text>
    </g>
  </svg>
</template>

<style scoped>
.mapa {
  display: block;
  width: 100%;
  height: auto;
  background: var(--color-niebla);
}

.mapa__trazo path,
.mapa__arbol circle {
  stroke: var(--color-tinta);
  stroke-width: 1.2;
  stroke-linejoin: round;
}

.mapa__manzana {
  fill: var(--color-blanco);
}

.mapa__parque {
  fill: var(--color-menta);
}

.mapa__arbol circle {
  fill: none;
}

.mapa__senda {
  fill: none;
  stroke-dasharray: 3 4;
}

.mapa__clinica {
  fill: var(--color-petroleo);
}

.mapa__calles path {
  fill: none;
  stroke: var(--color-tinta);
  stroke-width: 1;
  opacity: 0.5;
}

.mapa__eje {
  stroke-dasharray: 10 8;
  opacity: 0.35 !important;
}

.mapa__textos text {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  fill: var(--color-tinta);
}

.mapa__calle {
  text-anchor: middle;
  dominant-baseline: middle;
}

.mapa__textos text:first-child {
  text-anchor: start;
}

.mapa__parque-texto {
  text-anchor: middle;
  font-size: 9px;
}

.mapa__parada rect {
  fill: var(--color-blanco);
  stroke: var(--color-tinta);
  stroke-width: 1.2;
}

.mapa__parada text {
  font-family: var(--font-mono);
  font-size: 8px;
  font-weight: 700;
  text-anchor: middle;
  dominant-baseline: middle;
}

.mapa__aqui {
  --pz-relleno: var(--color-blanco);
}

.mapa__aqui-halo {
  fill: none;
  stroke: var(--color-tinta);
  stroke-width: 1.4;
  stroke-dasharray: 2 3;
}

.mapa__nota path {
  fill: none;
  stroke: var(--color-tinta);
  stroke-width: 1.3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mapa__nota text {
  font-family: var(--font-serif);
  font-size: 15px;
  text-anchor: middle;
  fill: var(--color-tinta);
}

.mapa__norte path {
  fill: var(--color-tinta);
}

.mapa__norte text {
  font-family: var(--font-mono);
  font-size: 9px;
  text-anchor: middle;
}
</style>
