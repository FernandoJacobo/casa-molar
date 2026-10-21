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
  background: var(--color-niebla);
}

.tonos__cuerpo {
  width: min(100% - 2 * var(--margen), var(--ancho));
  margin: clamp(2rem, 5vw, 3.5rem) auto 0;
}
</style>
