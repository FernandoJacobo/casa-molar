<script setup lang="ts">
/**
 * Comparador antes/después sobre sonrisas ilustradas. Un <input type="range"> nativo cubre el lienzo:
 * funciona con mouse, touch, teclado (flechas, Inicio/Fin, RePág/AvPág) y lector de pantalla.
 */
const pos = ref(50)
</script>

<template>
  <section class="ad" aria-labelledby="ad-titulo">
    <div class="ad__lienzo" :style="{ '--p': pos }">
      <div class="ad__capa ad__capa--antes">
        <SvgSonrisaSvg variante="antes" tono="#D4B685" titulo="Ilustración: sonrisa antes, con piezas apiñadas y tono A3.5" />
      </div>
      <div class="ad__capa ad__capa--despues">
        <SvgSonrisaSvg variante="despues" tono="#EEE3CF" titulo="Ilustración: sonrisa después, piezas alineadas y tono A1" />
      </div>
      <div class="ad__divisor" aria-hidden="true">
        <span class="ad__regla" />
        <span class="ad__asa">‹ ›</span>
      </div>
      <span class="ad__rotulo ad__rotulo--antes etiqueta" aria-hidden="true">Antes · A3.5</span>
      <span class="ad__rotulo ad__rotulo--despues etiqueta" aria-hidden="true">Después · A1</span>
      <input
        v-model.number="pos"
        type="range"
        min="0"
        max="100"
        step="1"
        class="ad__rango"
        aria-label="Comparar antes y después: desliza para ver más de cada lado"
        :aria-valuetext="`${pos} % antes, ${100 - pos} % después`"
      >
    </div>

    <div class="ad__texto">
      <p class="seccion-num"><b>§ 15</b><span>Antes / después</span></p>
      <h2 id="ad-titulo" class="h3 ad__titulo">Ortodoncia y blanqueamiento, en un mismo plan.</h2>
      <p>Primero se alinean, luego se aclaran. Al revés, el blanqueamiento se desperdicia entre pieza y pieza.</p>
      <p class="ad__sello etiqueta">Ilustración, no es un caso real</p>
    </div>
  </section>
</template>

<style scoped>
.ad {
  position: relative;
  padding-block: clamp(2rem, 5vw, 4rem);
  border-block: 1.5px solid var(--color-tinta);
  background: var(--color-marfil);
}

.ad__lienzo {
  position: relative;
  max-width: 78rem;
  margin-inline: auto;
  padding-inline: var(--margen);
  user-select: none;
}

.ad__capa {
  padding-block: 1rem;
}

.ad__capa--despues {
  position: absolute;
  inset: 0 var(--margen);
  clip-path: inset(0 0 0 calc(var(--p) * 1%));
}

.ad__divisor {
  position: absolute;
  top: 0;
  bottom: 0;
  left: calc(var(--margen) + (100% - 2 * var(--margen)) * var(--p) / 100);
  width: 0;
  pointer-events: none;
}

/* Línea de medición con ticks. */
.ad__regla {
  position: absolute;
  inset: 0 auto 0 -0.5px;
  width: 1.5px;
  background: var(--color-tinta);
}

.ad__regla::after {
  content: "";
  position: absolute;
  inset: 0 -5px;
  background: repeating-linear-gradient(180deg, var(--color-tinta) 0 1px, transparent 1px 14px);
  clip-path: inset(0 3px 0 3px);
  opacity: 0.6;
}

.ad__asa {
  position: absolute;
  top: 50%;
  left: 0;
  translate: -50% -50%;
  display: grid;
  place-items: center;
  width: 3.2rem;
  height: 3.2rem;
  border: 1.5px solid var(--color-tinta);
  border-radius: 50%;
  background: var(--color-coral);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: var(--shadow-carton-tinta);
}

.ad__rango {
  position: absolute;
  inset: 0 var(--margen);
  width: calc(100% - 2 * var(--margen));
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: ew-resize;
  touch-action: pan-y;
}

.ad__rango:focus-visible + * {
  outline: none;
}

.ad__lienzo:has(.ad__rango:focus-visible) .ad__asa {
  outline: 2.5px solid var(--color-coral-oscuro);
  outline-offset: 3px;
}

.ad__rotulo {
  position: absolute;
  bottom: 0.4rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-marfil);
  border: 1px solid var(--color-tinta);
}

.ad__rotulo--antes {
  left: var(--margen);
}

.ad__rotulo--despues {
  right: var(--margen);
}

.ad__texto {
  display: grid;
  gap: 0.75rem;
  max-width: 26rem;
  margin: 1.5rem var(--margen) 0;
}

.ad__titulo {
  font-size: clamp(1.6rem, 2.4vw, 1.9rem);
}

.ad__sello {
  justify-self: start;
  padding: 0.35rem 0.6rem;
  border: 1.5px dashed var(--color-coral-oscuro);
  color: var(--color-coral-oscuro);
  font-weight: 700;
  rotate: -2deg;
}

@media (min-width: 64rem) {
  /* Texto en una columna estrecha superpuesta en la esquina. */
  .ad__texto {
    position: absolute;
    top: clamp(1rem, 2vw, 2rem);
    right: var(--margen);
    margin: 0;
    max-width: 19rem;
    padding: 1.1rem 1.2rem;
    background: var(--color-marfil);
    border: 1.5px solid var(--color-tinta);
    z-index: 3;
  }

  .ad__lienzo {
    padding-right: calc(var(--margen) + 16rem);
  }

  .ad__capa--despues {
    inset: 0 calc(var(--margen) + 16rem) 0 var(--margen);
  }

  .ad__divisor {
    left: calc(var(--margen) + (100% - 2 * var(--margen) - 16rem) * var(--p) / 100);
  }

  .ad__rotulo--despues {
    right: calc(var(--margen) + 16rem);
  }

  .ad__rango {
    inset: 0 calc(var(--margen) + 16rem) 0 var(--margen);
    width: calc(100% - 2 * var(--margen) - 16rem);
  }
}
</style>
