<script setup lang="ts">
import { equipo } from '~/data/equipo'
import { tonoPorCodigo } from '~/data/tonos'
</script>

<template>
  <section class="equipo" aria-labelledby="equipo-titulo">
    <div class="contenedor">
      <UiCabezaSeccion id="equipo-titulo" num="18" rotulo="Quiénes te atienden" titulo="Cuatro personas, cada una con su tono.">
        Personas y datos ficticios, como todo en este demo. Los retratos están dibujados a mano.
      </UiCabezaSeccion>

      <ol class="equipo__escalera">
        <li v-for="(p, i) in equipo" :key="p.id" class="persona" :style="{ '--escalon': i }">
          <div class="persona__retrato">
            <SvgAvatarSvg :avatar="p.avatar" :nombre="p.nombre" />
            <UiPestanaTono class="persona__tono" :codigo="p.tono" :hex="tonoPorCodigo(p.tono)!.hex" tamano="chica" aria-hidden="true" />
          </div>
          <p class="etiqueta persona__rol">{{ p.rol }}</p>
          <h3 class="persona__nombre">{{ p.nombre }}</h3>
          <p class="persona__anios mono">{{ p.anios }} años de práctica <span>(ficticios)</span></p>
          <p class="persona__disfruta"><span class="etiqueta">Lo que más disfruta</span> {{ p.disfruta }}</p>
        </li>
      </ol>
      <NuxtLink to="/equipo" class="enlace equipo__mas">Conoce al equipo completo</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.equipo {
  padding-block: clamp(4rem, 9vw, 8rem);
}

.equipo__escalera {
  display: grid;
  gap: 3rem 1.5rem;
  margin-top: clamp(2.5rem, 6vw, 4rem);
}

.persona__retrato {
  position: relative;
  max-width: 13rem;
}

.persona__tono {
  position: absolute;
  right: -0.9rem;
  top: 38%;
  rotate: 12deg;
}

.persona__rol {
  margin-top: 1rem;
  color: var(--color-coral-oscuro);
}

.persona__nombre {
  font-size: 1.55rem;
  margin-top: 0.3rem;
  line-height: 1.05;
}

.persona__anios {
  font-size: 0.8rem;
  margin-top: 0.4rem;
}

.persona__anios span {
  color: var(--color-tinta-suave);
}

.persona__disfruta {
  margin-top: 0.8rem;
  font-size: 0.97rem;
  max-width: 30ch;
}

.persona__disfruta .etiqueta {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--color-tinta-suave);
}

.equipo__mas {
  display: inline-block;
  margin-top: 2.5rem;
}

@media (min-width: 40rem) {
  .equipo__escalera {
    grid-template-columns: 1fr 1fr;
  }

  .persona:nth-child(even) {
    margin-top: 5rem;
  }
}

@media (min-width: 64rem) {
  /* Escalera: cada columna baja un escalón. */
  .equipo__escalera {
    grid-template-columns: repeat(4, 1fr);
    align-items: start;
  }

  .persona:nth-child(even) {
    margin-top: 0;
  }

  .persona:nth-child(n) {
    margin-top: calc(var(--escalon) * 3.5rem);
  }

  .persona:nth-child(4) {
    margin-top: 1.5rem;
  }
}
</style>
