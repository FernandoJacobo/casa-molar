<template>
  <section id="tonos" class="tonos" aria-labelledby="tonos-titulo">
    <div class="tonos__cabeza contenedor">
      <UiCabezaSeccion id="tonos-titulo" num="13" rotulo="Guía de tonos" titulo="¿Qué tan blanco es blanco?">
        Los dientes no son blancos: tienen tono, y se mide con esta guía. Elige el tuyo y a dónde te gustaría llegar.
      </UiCabezaSeccion>
    </div>
    <div class="tonos__cuerpo">
      <TonosSimuladorTonos />
    </div>
  </section>
</template>

<style scoped>
.tonos {
  padding-block: clamp(4rem, 9vw, 8rem);
  background: var(--color-hueso);
  border-block: 1.5px solid var(--color-tinta);
}

.tonos__cuerpo {
  margin-top: clamp(2rem, 5vw, 3.5rem);
  padding-inline: var(--margen);
}

@media (min-width: 64rem) {
  .tonos__cuerpo {
    /* La franja se pega al borde izquierdo de la pantalla. */
    padding-left: 0;
    padding-right: var(--margen);
  }

  .tonos__cuerpo :deep(.sim__franja-caja) {
    padding-left: 0;
  }

  .tonos__cuerpo :deep(.sim__modo) {
    margin-left: var(--margen);
  }

  .tonos__cuerpo :deep(.sim__muestra) {
    border-left-width: calc(var(--margen) + 0.4rem);
    border-radius: 0 14px 14px 0;
  }
}
</style>
