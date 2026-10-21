<script setup lang="ts">
/**
 * Sprite con las piezas base en vista oclusal (en mm, centradas, cara exterior hacia −y). Se monta una vez en el layout y se reutiliza con <use href="#pz-…">.
 * Los tamaños de referencia coinciden con `BASE` en utils/arcada.ts.
 */
</script>

<template>
  <svg class="sprite" aria-hidden="true" focusable="false" width="0" height="0">
    <defs>
      <g id="pz-incisivo">
        <path class="pz-contorno" d="M-4,-1.6 C-4,-3.5 4,-3.5 4,-1.6 C4,0.7 1.7,3.5 0,3.5 C-1.7,3.5 -4,0.7 -4,-1.6Z" />
        <path class="pz-surco" d="M-2.9,-1.75 Q0,-2.55 2.9,-1.75 M-1,2.1 Q0,1.3 1,2.1" />
      </g>
      <g id="pz-canino">
        <path class="pz-contorno" d="M0,-4 C2.4,-3.8 4,-1.6 3.8,0 C3.6,2 1.8,4 0,4 C-1.8,4 -3.6,2 -3.8,0 C-4,-1.6 -2.4,-3.8 0,-4Z" />
        <path class="pz-surco" d="M-2.6,-0.5 L0,-1.6 L2.6,-0.5 M0,-1.6 L0,2.2" />
      </g>
      <g id="pz-premolar">
        <path class="pz-contorno" d="M-3.5,0 C-3.5,-3.3 -2,-4.5 0,-4.5 C2,-4.5 3.5,-3.3 3.5,0 C3.5,3.3 2,4.5 0,4.5 C-2,4.5 -3.5,3.3 -3.5,0Z" />
        <path class="pz-surco" d="M-2.2,0.25 C-1,-0.6 1,-0.6 2.2,0.25" />
        <circle class="pz-fosa" cx="-2.2" cy="0.25" r="0.38" />
        <circle class="pz-fosa" cx="2.2" cy="0.25" r="0.38" />
      </g>
      <g id="pz-molar">
        <path class="pz-contorno" d="M-4.6,-3.8 C-2,-5.8 2.6,-5.6 4.8,-3.6 C5.4,-1 5.2,2.6 4.4,4.4 C2,5.8 -2.4,5.8 -4.6,4.2 C-5.4,1.6 -5.4,-1.6 -4.6,-3.8Z" />
        <path class="pz-surco" d="M-3.3,0.4 C-1.4,-0.5 1.4,0.9 3.3,-0.2 M0.1,0.2 L-0.3,-4.3 M0.1,0.3 L0.7,4.5" />
        <circle class="pz-fosa" cx="0.1" cy="0.25" r="0.45" />
      </g>
      <g id="pz-cordal">
        <path class="pz-contorno" d="M-4,-3.2 C-1.6,-5.2 2.6,-5 4.2,-2.8 C4.8,-0.4 4.4,2.8 3.4,4 C1,5.2 -2.2,5 -3.8,3.6 C-4.8,1.2 -4.8,-1.4 -4,-3.2Z" />
        <path class="pz-surco" d="M-2.6,0.6 C-1,-0.8 0.8,1.2 2.6,-0.2 M0,0.2 L-0.6,-3.8 M0.2,0.4 L1.2,3.8" />
      </g>
    </defs>
  </svg>
</template>

<style>
.sprite {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* Las piezas toman su color de variables que se heredan desde cada <use>. */
.pz-contorno {
  fill: var(--pz-relleno, var(--color-blanco));
  stroke: var(--pz-trazo, var(--color-petroleo-oscuro));
  stroke-width: var(--pz-grosor, 1.1px);
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.pz-surco {
  fill: none;
  stroke: var(--pz-trazo, var(--color-petroleo-oscuro));
  stroke-width: var(--pz-grosor-surco, 0.8px);
  stroke-linecap: round;
  opacity: 0.4;
  vector-effect: non-scaling-stroke;
}

.pz-fosa {
  fill: var(--pz-trazo, var(--color-petroleo-oscuro));
  opacity: 0.35;
}
</style>
