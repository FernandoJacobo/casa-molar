<script setup lang="ts">
useSeoPagina('Precios, plan y financiamiento', 'Lista de precios "desde", arma tu plan de tratamiento eligiendo piezas en el odontograma y simula tu mensualidad a meses. Precios ilustrativos.')

const totalPlan = ref(0)
</script>

<template>
  <div class="precios">
    <section class="contenedor precios__bloque" aria-labelledby="lista-titulo">
      <UiCabezaSeccion id="lista-titulo" as="h1" num="21" rotulo="Lista de precios" titulo="Precios, a la vista.">
        Todos "desde": el precio final depende de lo que veamos en la valoración, y te lo damos por escrito antes de empezar.
      </UiCabezaSeccion>
      <p class="precios__aviso etiqueta">Precios ilustrativos · MXN · sujetos a valoración</p>
      <div class="precios__lista">
        <PreciosListaPrecios />
      </div>
    </section>

    <section id="plan" class="precios__plan" aria-labelledby="plan-titulo">
      <div class="contenedor">
        <UiCabezaSeccion id="plan-titulo" num="22" rotulo="Plan de tratamiento" titulo="Arma tu plan.">
          Elige lo que crees necesitar (o lo que te dijeron en otra clínica). Te damos la hoja con piezas, citas y total.
        </UiCabezaSeccion>
        <div class="precios__plan-cuerpo">
          <PreciosPlanTratamiento @total="totalPlan = $event" />
        </div>
      </div>
    </section>

    <section id="financiamiento" class="contenedor precios__bloque" aria-labelledby="fin-titulo">
      <UiCabezaSeccion id="fin-titulo" num="23" rotulo="Financiamiento" titulo="A meses, sin sorpresas.">
        A 3, 6 o 12 meses sin intereses, o a más plazo con una tasa que ves antes de firmar.
      </UiCabezaSeccion>
      <div class="precios__fin">
        <PreciosCalculadoraFinanciamiento :total-plan="totalPlan" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.precios__bloque {
  padding-block: clamp(2rem, 5vw, 4rem) clamp(3rem, 7vw, 6rem);
  scroll-margin-top: 1rem;
}

.precios__aviso {
  margin-top: 1.25rem;
  color: var(--color-coral-oscuro);
}

.precios__lista,
.precios__fin {
  margin-top: clamp(2rem, 5vw, 3rem);
}

.precios__plan {
  padding-block: clamp(3rem, 7vw, 6rem);
  background: var(--color-hueso);
  border-block: 1.5px solid var(--color-tinta);
  scroll-margin-top: 1rem;
}

.precios__plan-cuerpo {
  margin-top: clamp(2rem, 5vw, 3rem);
}

@media print {
  .precios__bloque,
  .precios__plan :deep(.cabeza) {
    display: none !important;
  }

  .precios__plan {
    background: #fff;
    border: 0;
    padding: 0;
  }

  .precios__plan-cuerpo {
    margin: 0;
  }
}
</style>
