<script setup lang="ts">
/** Avatar ilustrado de línea, recortado en forma de corona de molar. Personas ficticias. */
import type { Profesional } from '~/data/equipo'

const props = defineProps<{ avatar: Profesional['avatar']; nombre?: string }>()
const id = useId()
const a = computed(() => props.avatar)

const SILUETA = 'M6,152 L6,44 C6,14 30,4 46,14 Q60,23 74,14 C90,4 114,14 114,44 L114,152 Z'
const RIZOS = [
  [38, 52, 9], [44, 40, 9], [54, 34, 9], [66, 34, 9], [76, 40, 9], [82, 52, 9],
  [34, 64, 8], [86, 64, 8], [34, 78, 7], [86, 78, 7], [60, 31, 8],
]
</script>

<template>
  <svg class="avatar" viewBox="0 0 120 156" :role="nombre ? 'img' : undefined" :aria-label="nombre ? `Retrato ilustrado de ${nombre}` : undefined" :aria-hidden="nombre ? undefined : 'true'" focusable="false">
    <defs>
      <clipPath :id="`silueta-${id}`">
        <path :d="SILUETA" />
      </clipPath>
    </defs>
    <path :d="SILUETA" class="avatar__fondo" />
    <g :clip-path="`url(#silueta-${id})`" class="avatar__persona">
      <!-- Cabello de atrás -->
      <path v-if="a.peinado === 'lacio'" class="avatar__pelo" d="M33,72 C30,36 90,36 87,72 L91,118 C80,124 40,124 29,118 Z" />
      <g v-if="a.peinado === 'rizado'" class="avatar__pelo">
        <circle v-for="(r, i) in RIZOS" :key="i" :cx="r[0]" :cy="r[1]" :r="r[2]" />
      </g>

      <!-- Hombros con filipina -->
      <path class="avatar__ropa" d="M8,156 C12,124 36,112 60,112 C84,112 108,124 112,156 Z" />
      <path class="avatar__linea" d="M47,113 L60,134 L73,113" />
      <path class="avatar__acento" d="M86,128 L88,146" />
      <!-- Cuello -->
      <path class="avatar__piel" d="M51,94 L51,113 Q60,120 69,113 L69,94 Z" />
      <!-- Orejas -->
      <path class="avatar__piel" d="M39,70 C32,68 32,82 40,82 M81,70 C88,68 88,82 80,82" />
      <!-- Cara -->
      <ellipse class="avatar__piel" cx="60" cy="72" rx="21.5" ry="26" />

      <!-- Barba -->
      <path v-if="a.barba" class="avatar__pelo" d="M39,74 C40,96 52,100 60,100 C68,100 80,96 81,74 C76,88 68,90 60,90 C52,90 44,88 39,74 Z" />

      <!-- Cabello de enfrente -->
      <path v-if="a.peinado === 'chongo'" class="avatar__pelo" d="M38.5,70 C34,42 50,44 60,44 C72,44 86,44 81.5,70 C78,56 68,52 58,52 C48,53 41,58 38.5,70 Z" />
      <circle v-if="a.peinado === 'chongo'" class="avatar__pelo" cx="61" cy="38" r="10" />
      <path v-if="a.peinado === 'corto'" class="avatar__pelo" d="M38.5,66 C36,40 84,38 81.5,66 C78,54 70,50 58,51 C48,52 42,56 38.5,66 Z" />
      <path v-if="a.peinado === 'lacio'" class="avatar__pelo" d="M38.5,70 C36,42 84,40 81.5,70 C78,58 64,50 50,56 C45,59 41,64 38.5,70 Z" />
      <path v-if="a.peinado === 'rizado'" class="avatar__pelo" d="M39,64 C40,48 80,46 81,64 C74,56 66,54 60,56 C52,54 46,56 39,64 Z" />

      <!-- Rasgos -->
      <path class="avatar__linea" d="M48,73 Q52,69.5 56,73 M64,73 Q68,69.5 72,73" />
      <path class="avatar__linea" d="M60,76 Q57,83 61.5,84" />
      <path class="avatar__linea" :class="{ 'avatar__linea--clara': a.barba }" d="M53,90 Q60,95 67,90" />
      <g v-if="a.lentes" class="avatar__lentes">
        <rect x="44" y="66" width="13" height="10" rx="3" />
        <rect x="63" y="66" width="13" height="10" rx="3" />
        <path d="M57,70 Q60,68 63,70 M44,70 L39,68 M76,70 L81,68" />
      </g>
      <g v-if="a.aretes" class="avatar__aretes">
        <circle cx="38" cy="85" r="2.6" />
        <circle cx="82" cy="85" r="2.6" />
      </g>
    </g>
    <path :d="SILUETA" class="avatar__borde" />
  </svg>
</template>

<style scoped>
.avatar {
  display: block;
  width: 100%;
  height: auto;
}

.avatar__fondo {
  fill: var(--avatar-fondo, var(--color-hueso));
}

.avatar__borde {
  fill: none;
  stroke: var(--color-tinta);
  stroke-width: 1.6;
  stroke-linejoin: round;
}

.avatar__persona {
  filter: url(#trazo);
}

.avatar__piel,
.avatar__ropa {
  fill: var(--color-marfil);
  stroke: var(--color-tinta);
  stroke-width: 1.4;
  stroke-linejoin: round;
}

.avatar__pelo,
.avatar__pelo circle {
  fill: var(--color-tinta);
}

.avatar__linea {
  fill: none;
  stroke: var(--color-tinta);
  stroke-width: 1.4;
  stroke-linecap: round;
}

.avatar__linea--clara {
  stroke: var(--color-marfil);
}

.avatar__acento {
  fill: none;
  stroke: var(--color-coral);
  stroke-width: 2.4;
  stroke-linecap: round;
}

.avatar__lentes rect,
.avatar__lentes path {
  fill: none;
  stroke: var(--color-tinta);
  stroke-width: 1.4;
}

.avatar__aretes circle {
  fill: var(--color-coral);
  stroke: var(--color-tinta);
  stroke-width: 1;
}
</style>
