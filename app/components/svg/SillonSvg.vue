<template>
  <svg class="sillon" viewBox="0 0 320 240" aria-hidden="true" focusable="false">
    <g class="sillon__trazo">
      <!-- Lámpara -->
      <path d="M232,18 L232,62 Q232,74 220,78 L186,90" />
      <path class="sillon__lampara" d="M160,82 Q174,70 192,80 L196,98 Q178,108 164,98 Z" />
      <path class="sillon__luz" d="M166,104 L150,128 M178,106 L172,134 M190,102 L196,128" />
      <!-- Respaldo y asiento -->
      <path class="sillon__tapiz" d="M58,58 Q46,62 50,76 L84,150 Q90,160 104,160 L232,160 Q248,160 252,148 Q254,138 240,136 L118,136 Q108,136 104,128 L76,64 Q72,54 58,58 Z" />
      <path class="sillon__tapiz" d="M40,30 Q32,36 38,48 L52,62 Q60,66 66,58 L54,38 Q48,28 40,30 Z" />
      <path d="M86,150 L262,142" class="sillon__costura" />
      <!-- Base -->
      <path d="M170,160 L170,206 M128,212 L214,212 Q222,212 222,206 L222,200 L120,200 L120,206 Q120,212 128,212 Z" />
      <!-- Mesita de instrumentos -->
      <path d="M262,108 L300,104 M282,106 L282,212 M266,212 L298,212" />
      <path class="sillon__instr" d="M268,98 L272,86 M278,98 L282,84 M288,96 L292,82" />
      <!-- Escupidera -->
      <path d="M22,128 Q20,146 34,148 L50,148 Q62,146 60,128 Z M41,148 L41,212 M30,212 L52,212" />
    </g>
  </svg>
</template>

<style scoped>
.sillon {
  display: block;
  width: 100%;
  height: auto;
}

.sillon__trazo {
  filter: url(#trazo);
}

.sillon__trazo path {
  fill: none;
  stroke: var(--color-tinta);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.sillon__trazo .sillon__tapiz {
  fill: var(--color-coral);
}

.sillon__trazo .sillon__lampara {
  fill: var(--color-hueso);
}

.sillon__luz {
  stroke-dasharray: 4 5;
  opacity: 0.6;
}

.sillon__costura {
  stroke-dasharray: 3 4;
  opacity: 0.5;
}
</style>
