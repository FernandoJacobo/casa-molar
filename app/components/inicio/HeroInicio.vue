<script setup lang="ts">
import { site } from '~/config/site'

const estado = useEstadoClinica()
</script>

<template>
  <section class="hero" aria-labelledby="hero-titulo">
    <div class="contenedor hero__rejilla">
      <div class="hero__texto">
        <p class="etiqueta hero__lugar">Odontología general y especialidades · {{ site.direccion.colonia }}, {{ site.direccion.ciudad }}</p>
        <h1 id="hero-titulo" class="hero__titulo">Cuidamos las <em>32.</em></h1>
        <p class="hero__entrada">
          Te explicamos lo que vemos antes de hacer nada, con precio por escrito. Y si algo no lo necesitas, te lo decimos.
        </p>

        <div class="hero__acciones">
          <NuxtLink to="/cita" class="boton boton--primario">Agendar valoración</NuxtLink>
          <NuxtLink to="/precios" class="boton boton--claro">Ver precios</NuxtLink>
        </div>

        <dl class="hero__datos">
          <div>
            <dt class="etiqueta">Valoración</dt>
            <dd>45 min · $450 <small>se descuenta si inicias tratamiento</small></dd>
          </div>
          <div>
            <dt class="etiqueta">Hoy</dt>
            <dd>{{ estado ? estado.titulo : 'L–V 9:00–19:00' }}<small v-if="estado?.detalle">{{ estado.detalle }}</small></dd>
          </div>
          <div>
            <dt class="etiqueta">Urgencias</dt>
            <dd><a :href="`tel:${site.urgencias.enlace}`">{{ site.urgencias.visible }}</a></dd>
          </div>
        </dl>
      </div>

      <figure class="hero__panel">
        <SvgArcadaSvg modo="superior" destello numeros class="hero__arcada" />
        <figcaption class="hero__pie">
          <span class="etiqueta">Arcada superior · vista oclusal</span>
          <span>16 de tus 32 piezas. Cada una tiene número y la revisamos una por una.</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-block: clamp(2rem, 5vw, 4.5rem) clamp(3rem, 6vw, 5.5rem);
  background: var(--color-blanco);
}

.hero__rejilla {
  display: grid;
  gap: 2.5rem;
  align-items: center;
}

.hero__lugar {
  color: var(--color-petroleo);
}

.hero__titulo {
  margin-top: 1rem;
  font-size: clamp(2.9rem, 7vw, 5.4rem);
  line-height: 1;
  letter-spacing: -0.025em;
}

.hero__titulo em {
  font-style: italic;
  color: var(--color-petroleo);
}

.hero__entrada {
  margin-top: 1.25rem;
  max-width: 34ch;
  font-size: clamp(1.1rem, 1.5vw, 1.25rem);
  line-height: 1.55;
  color: var(--color-tinta-suave);
}

.hero__acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.hero__datos {
  display: grid;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-linea);
}

.hero__datos .etiqueta {
  color: var(--color-tinta-suave);
}

.hero__datos dd {
  margin-top: 0.25rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.hero__datos small {
  display: block;
  font-weight: 400;
  font-size: 0.85rem;
  color: var(--color-tinta-suave);
}

.hero__datos a {
  color: var(--color-petroleo);
  text-decoration: none;
}

.hero__panel {
  position: relative;
  display: grid;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  border-radius: 24px;
  background: var(--color-niebla);
}

.hero__arcada {
  width: 100%;
  max-width: 34rem;
  margin-inline: auto;
}

.hero__pie {
  display: grid;
  gap: 0.25rem;
  max-width: 36ch;
  font-size: 0.92rem;
  color: var(--color-tinta-suave);
}

.hero__pie .etiqueta {
  color: var(--color-petroleo);
}

@media (min-width: 40rem) {
  .hero__datos {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .hero__rejilla {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    gap: clamp(3rem, 6vw, 6rem);
  }
}
</style>
