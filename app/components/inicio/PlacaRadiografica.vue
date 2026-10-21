<script setup lang="ts">
import { tecnologia } from '~/data/contenido'
</script>

<template>
  <section class="placa" aria-labelledby="placa-titulo">
    <div class="contenedor">
      <div class="placa__cabeza">
        <p class="seccion-num placa__num"><span>Placa · tecnología</span></p>
        <h2 id="placa-titulo" class="h2 placa__titulo">Vemos lo que el espejo no alcanza.</h2>
        <p class="placa__entrada">Tres herramientas, explicadas sin tecnicismos. Ninguna duele.</p>
      </div>

      <div class="placa__lamina">
        <p class="placa__marca mono" aria-hidden="true">R · PANORÁMICA · CM-DEMO · 2026</p>
        <SvgPanoramicaSvg class="placa__svg" />
        <ol class="placa__notas">
          <li v-for="(t, i) in tecnologia" :key="t.titulo" class="placa__nota" :class="`placa__nota--${i + 1}`">
            <span class="placa__n mono" aria-hidden="true">{{ i + 1 }}</span>
            <div>
              <h3 class="placa__nota-titulo">{{ t.titulo }}</h3>
              <p>{{ t.texto }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.placa {
  background: var(--color-placa);
  color: var(--color-placa-texto);
  padding-block: clamp(4rem, 9vw, 8rem);
  overflow: hidden;
}

.placa__num {
  color: var(--color-placa-texto);
}

.placa__titulo {
  margin-top: 0.8rem;
  max-width: 14ch;
  color: var(--color-blanco);
}

.placa__entrada {
  margin-top: 1rem;
  max-width: 36ch;
}

.placa__lamina {
  position: relative;
  margin-top: clamp(2rem, 5vw, 3rem);
}

.placa__marca {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: var(--color-placa-linea);
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.placa__svg {
  border: 1px solid rgb(143 196 208 / 0.35);
}

.placa__notas {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.placa__nota {
  display: grid;
  grid-template-columns: 2.2rem 1fr;
  gap: 0.8rem;
  align-items: start;
}

.placa__n {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  background: var(--color-placa-linea);
  color: var(--color-placa);
  font-weight: 700;
}

.placa__nota-titulo {
  font-size: 1.35rem;
  color: var(--color-blanco);
  margin-bottom: 0.3rem;
}

.placa__nota p {
  font-size: 0.98rem;
  max-width: 38ch;
}

@media (min-width: 64rem) {
  .placa__cabeza {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: end;
    column-gap: 3rem;
  }

  .placa__num {
    grid-column: 1 / -1;
  }

  /* Las anotaciones salen hacia los márgenes de la placa, con una flecha hacia su marcador. */
  .placa__lamina {
    padding: 5.5rem 0 9rem;
  }

  .placa__notas {
    margin: 0;
  }

  .placa__nota {
    position: absolute;
    width: 19rem;
  }

  .placa__nota--1 {
    top: 0;
    left: 28%;
  }

  .placa__nota--2 {
    top: 52%;
    right: -2rem;
    width: 17rem;
    padding: 1rem;
    background: var(--color-placa);
    border: 1px solid rgb(143 196 208 / 0.35);
  }

  .placa__nota--3 {
    bottom: 0;
    left: 6%;
  }

  .placa__nota::before {
    content: "";
    position: absolute;
    border-color: var(--color-placa-linea);
    border-style: dashed;
    border-width: 0;
    opacity: 0.6;
  }

  .placa__nota--1::before {
    left: 1.1rem;
    top: 2.4rem;
    height: 6.2rem;
    border-left-width: 1.5px;
  }

  .placa__nota--3::before {
    left: 1.1rem;
    bottom: 2.4rem;
    height: 5.5rem;
    border-left-width: 1.5px;
  }
}
</style>
