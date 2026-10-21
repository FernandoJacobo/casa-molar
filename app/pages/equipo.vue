<script setup lang="ts">
import { equipo } from '~/data/equipo'
import { tratamientoPorSlug } from '~/data/tratamientos'

useSeoPagina('Equipo', 'Quiénes te atienden en Casa Molar (demo): cuatro profesionales ficticios, qué hace cada quien y qué días da consulta.')

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
</script>

<template>
  <div class="eq contenedor">
    <UiCabezaSeccion as="h1" num="18" rotulo="Equipo" titulo="Quiénes te atienden.">
      Cuatro especialistas (ficticios). Si llegas con miedo, cualquiera de ellas te va a explicar todo antes de empezar.
    </UiCabezaSeccion>

    <ol class="eq__lista">
      <li v-for="(p, i) in equipo" :key="p.id" class="pro" :class="{ 'pro--der': i % 2 === 1 }">
        <div class="pro__retrato">
          <SvgAvatarSvg :avatar="p.avatar" :nombre="p.nombre" />
        </div>
        <div class="pro__texto">
          <p class="etiqueta pro__rol">{{ p.rol }}</p>
          <h2 class="h2 pro__nombre">{{ p.nombre }}</h2>
          <blockquote class="pro__frase">“{{ p.frase }}”</blockquote>
          <dl class="pro__datos">
            <div><dt class="etiqueta">Formación</dt><dd>{{ p.especialidad }}</dd></div>
            <div><dt class="etiqueta">Cédula</dt><dd class="mono">{{ p.cedula }}</dd></div>
            <div><dt class="etiqueta">Práctica</dt><dd>{{ p.anios }} años (ficticios)</dd></div>
            <div>
              <dt class="etiqueta">Consulta</dt>
              <dd class="pro__dias mono">
                <span v-for="(d, n) in DIAS" :key="d" :class="{ 'is-dia': p.dias.includes(n) }">{{ d }}</span>
              </dd>
            </div>
          </dl>
          <p class="pro__disfruta"><span class="etiqueta">Lo que más disfruta</span> {{ p.disfruta }}</p>
          <p class="pro__trat">
            <NuxtLink v-for="s in p.tratamientos" :key="s" :to="`/tratamientos/${s}`" class="pro__chip">{{ tratamientoPorSlug(s)?.nombre }}</NuxtLink>
          </p>
          <NuxtLink :to="{ path: '/cita', query: { profesional: p.id } }" class="boton boton--claro">Agendar con {{ p.trato }}</NuxtLink>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.eq {
  padding-block: clamp(2rem, 5vw, 4rem);
}

.eq__lista {
  display: grid;
  gap: clamp(3rem, 8vw, 6rem);
  margin-top: clamp(2.5rem, 6vw, 4rem);
}

.pro {
  display: grid;
  gap: 1.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-linea);
}

.pro__retrato {
  position: relative;
  width: min(16rem, 70%);
}

.pro__rol {
  color: var(--color-petroleo-oscuro);
}

.pro__nombre {
  margin-top: 0.5rem;
  font-size: clamp(2.2rem, 5vw, 3.6rem);
}

.pro__frase {
  margin: 1rem 0 0;
  font-family: var(--font-serif);
  font-size: clamp(1.3rem, 2.4vw, 1.7rem);
  line-height: 1.2;
  color: var(--color-petroleo-oscuro);
  max-width: 28ch;
}

.pro__datos {
  display: grid;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.pro__datos div {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px dotted var(--color-linea-fuerte);
}

.pro__dias {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  font-size: 0.72rem;
}

.pro__dias span {
  padding: 0.1rem 0.3rem;
  color: var(--color-tinta-suave);
  text-decoration: line-through;
}

.pro__dias .is-dia {
  background: var(--color-menta);
  color: var(--color-tinta);
  text-decoration: none;
}

.pro__disfruta {
  margin-top: 1.25rem;
  max-width: 50ch;
}

.pro__disfruta .etiqueta {
  display: block;
  color: var(--color-tinta-suave);
  margin-bottom: 0.2rem;
}

.pro__trat {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 1.25rem 0 1.5rem;
}

.pro__chip {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0 0.8rem;
  border: 1px solid var(--color-linea);
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.92rem;
}

.pro__chip:hover {
  background: var(--color-menta);
}

@media (min-width: 64rem) {
  .pro {
    grid-template-columns: 18rem 1fr;
    gap: 4rem;
    align-items: start;
  }

  .pro__retrato {
    width: 100%;
  }

  .pro--der {
    grid-template-columns: 1fr 18rem;
  }

  .pro--der .pro__retrato {
    order: 2;
    margin-top: 4rem;
  }
}
</style>
