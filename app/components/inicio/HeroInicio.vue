<script setup lang="ts">
import { site } from '~/config/site'
</script>

<template>
  <section class="hero" aria-labelledby="hero-titulo">
    <div class="contenedor hero__rejilla">
      <p class="seccion-num hero__num"><b>§ 11</b><span>{{ site.direccion.colonia }}, {{ site.direccion.ciudad }}</span></p>
      <h1 id="hero-titulo" class="hero__titulo">
        <span class="hero__linea">Cuidamos</span>
        <span class="hero__linea hero__linea--2">las <em>32.</em></span>
      </h1>

      <p class="hero__entrada">
        Odontología de barrio. Te explicamos lo que vemos antes de hacer nada, y si algo no lo necesitas,
        te lo decimos.
      </p>

      <div class="hero__cta">
        <NuxtLink to="/cita" class="hero__tarjeta-enlace">
          <UiTarjetaCita etiqueta="Primera cita" folio="0001" :giro="-2.5">
            <span class="hero__tarjeta-titulo">Agendar valoración</span>
            <span class="hero__tarjeta-dato mono">45 min · $450 · se descuenta si inicias tratamiento</span>
            <span class="hero__tarjeta-flecha" aria-hidden="true">→</span>
          </UiTarjetaCita>
        </NuxtLink>
        <NuxtLink to="/precios" class="enlace hero__secundario">o mira primero la lista de precios</NuxtLink>
      </div>
    </div>

    <figure class="hero__arcada">
      <SvgArcadaSvg modo="superior" destello numeros />
      <figcaption class="etiqueta hero__pie">Fig. 1 — Arcada superior, vista oclusal. 16 de las 32.</figcaption>
    </figure>
    <p class="hero__nota" aria-hidden="true">
      <span>esta es la 11</span>
      <svg viewBox="0 0 80 60"><path d="M4,6 C30,4 56,16 70,48 M62,44 L70,49 L72,39" /></svg>
    </p>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding-top: clamp(1.5rem, 4vw, 3rem);
  min-height: min(56rem, 92vh);
}

.hero__rejilla {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 1.4rem;
}

.hero__titulo {
  font-size: clamp(4.2rem, 15.5vw, 14rem);
  line-height: 0.86;
  letter-spacing: -0.045em;
  /* El titular se sale de su caja hacia la derecha y se monta en la arcada. */
  width: max-content;
  max-width: none;
}

.hero__linea {
  display: block;
}

.hero__linea--2 {
  padding-left: 0.62em;
}

.hero__titulo em {
  font-style: normal;
  color: var(--color-coral-titular);
}

.hero__entrada {
  max-width: 30ch;
  font-size: clamp(1.1rem, 1.6vw, 1.3rem);
  line-height: 1.45;
}

.hero__cta {
  display: grid;
  justify-items: start;
  gap: 1.2rem;
  margin-top: 0.5rem;
}

.hero__tarjeta-enlace {
  display: block;
  width: min(22rem, 100%);
  text-decoration: none;
  transition: translate 0.15s var(--ease-suave);
}

.hero__tarjeta-enlace :deep(.tarjeta) {
  transition: box-shadow 0.15s var(--ease-suave), rotate 0.3s var(--ease-suave);
}

.hero__tarjeta-enlace:hover :deep(.tarjeta) {
  rotate: -1deg;
}

.hero__tarjeta-enlace:active {
  translate: 3px 4px;
}

.hero__tarjeta-enlace:active :deep(.tarjeta) {
  box-shadow: 0 0 0 var(--color-arena);
}

.hero__tarjeta-titulo {
  display: block;
  font-family: var(--font-serif);
  font-size: 1.85rem;
  line-height: 1.05;
  padding-top: 0.3rem;
}

.hero__tarjeta-dato {
  display: block;
  margin-top: 0.55rem;
  font-size: 0.78rem;
  line-height: 2rem;
  color: var(--color-tinta-suave);
}

.hero__tarjeta-flecha {
  position: absolute;
  right: 1.1rem;
  bottom: 0.9rem;
  font-size: 1.6rem;
  color: var(--color-coral-oscuro);
}

.hero__arcada {
  position: relative;
  z-index: 1;
  width: 128vw;
  margin: -2rem 0 -38vw -2vw;
  rotate: -9deg;
}

.hero__pie {
  position: absolute;
  top: 34%;
  left: 40%;
  rotate: 14deg;
  color: var(--color-tinta-suave);
  max-width: 16ch;
  display: none;
}

.hero__nota {
  display: none;
}

@media (min-width: 48rem) {
  .hero__arcada {
    position: absolute;
    width: min(72vw, 76rem);
    right: -14vw;
    top: 8%;
    margin: 0;
    rotate: -14deg;
  }

  .hero__pie {
    display: block;
  }

  .hero__rejilla {
    padding-bottom: clamp(4rem, 9vw, 8rem);
  }

  .hero__titulo {
    margin-top: 0.5rem;
  }
}

@media (min-width: 64rem) {
  .hero__rejilla {
    grid-template-columns: minmax(0, 30rem) 1fr;
    column-gap: 3rem;
  }

  .hero__num,
  .hero__titulo {
    grid-column: 1 / -1;
  }

  .hero__arcada {
    width: min(66vw, 70rem);
    right: -12vw;
    top: 4%;
  }

  .hero__nota {
    display: flex;
    position: absolute;
    z-index: 2;
    right: calc(max(-12vw, -10rem) + min(33vw, 35rem) + 5rem);
    top: 1.5rem;
    align-items: flex-start;
    gap: 0.2rem;
    font-family: var(--font-serif);
    font-size: 1.3rem;
    rotate: -4deg;
  }

  .hero__nota svg {
    width: 4.5rem;
    margin-top: 0.8rem;
  }

  .hero__nota path {
    fill: none;
    stroke: var(--color-tinta);
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
}
</style>
