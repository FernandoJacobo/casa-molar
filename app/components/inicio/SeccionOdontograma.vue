<script setup lang="ts">
const activa = ref<number | null>(null)
const panel = ref<HTMLElement | null>(null)
const esMovil = useMediaQuery('(max-width: 63.99rem)')

// En pantallas chicas el panel queda debajo: se lleva la vista hacia él al elegir una pieza.
watch(activa, (fdi) => {
  if (fdi && esMovil.value) nextTick(() => panel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
})
</script>

<template>
  <section id="odontograma" class="odo" aria-labelledby="odo-titulo">
    <div class="contenedor">
      <UiCabezaSeccion id="odo-titulo" num="12" rotulo="Odontograma" titulo="Toca la pieza que te molesta.">
        El mapa que usamos en consulta, con la numeración de verdad: el primer número es el cuadrante,
        el segundo, la pieza.
      </UiCabezaSeccion>

      <div class="odo__rejilla">
        <div class="odo__instrumento">
          <OdontogramaInteractivo v-model:activa="activa" etiqueta="Odontograma de 32 piezas: elige una para ver su información" />
          <p class="etiqueta odo__leyenda">Vista oclusal · tu derecha queda a la izquierda, como te vemos desde el sillón</p>
        </div>
        <div ref="panel" class="odo__panel">
          <OdontogramaPanelPieza :fdi="activa" @cerrar="activa = null" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.odo {
  padding-block: clamp(3rem, 6vw, 5rem) clamp(4rem, 9vw, 8rem);
  scroll-margin-top: 1rem;
}

.odo__rejilla {
  display: grid;
  gap: 2.5rem;
  margin-top: clamp(2rem, 5vw, 3.5rem);
}

.odo__instrumento {
  position: relative;
  max-width: 34rem;
  width: 100%;
  justify-self: center;
}

.odo__leyenda {
  margin-top: 1.8rem;
  text-align: center;
  color: var(--color-tinta-suave);
  text-transform: none;
  letter-spacing: 0.02em;
}

.odo__panel {
  scroll-margin-top: 1rem;
}

@media (min-width: 64rem) {
  .odo__rejilla {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: start;
    gap: clamp(3rem, 6vw, 6rem);
  }

  .odo__panel {
    position: sticky;
    top: 1.5rem;
    padding: 1.5rem 0 1.5rem clamp(1.5rem, 3vw, 3rem);
    border-left: 1.5px solid var(--color-tinta);
    min-height: 26rem;
  }
}
</style>
