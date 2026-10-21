<script setup lang="ts">
import { resenas } from '~/data/contenido'
</script>

<template>
  <section class="escriben" aria-labelledby="escriben-titulo">
    <div class="contenedor escriben__rejilla">
      <div class="escriben__cabeza">
        <UiCabezaSeccion id="escriben-titulo" num="21" rotulo="Lo que nos escriben" titulo="Mensajes después de la cita.">
          Así nos escriben (bueno, así nos escribirían: son reseñas ficticias para este demo).
        </UiCabezaSeccion>
      </div>
      <div class="escriben__hilo">
        <p class="etiqueta escriben__fecha">Esta semana</p>
        <UiBurbujaChat
          v-for="(r, i) in resenas"
          :key="i"
          :nombre="r.nombre"
          :hora="r.hora"
          :lado="r.de === 'clinica' ? 'der' : 'izq'"
          :ficticia="r.de === 'paciente'"
        >
          {{ r.texto }}
        </UiBurbujaChat>
      </div>
    </div>
  </section>
</template>

<style scoped>
.escriben {
  padding-block: clamp(4rem, 9vw, 8rem);
  background: var(--color-niebla);
  border-block: 1px solid var(--color-linea);
}

.escriben__rejilla {
  display: grid;
  gap: 2.5rem;
}

.escriben__hilo {
  display: grid;
  gap: 1.1rem;
}

.escriben__fecha {
  justify-self: center;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--color-linea-fuerte);
  color: var(--color-tinta-suave);
}

/* Anchos distintos para que no parezca una cuadrícula. */
.escriben__hilo > :nth-child(3) { max-width: min(34rem, 92%); }
.escriben__hilo > :nth-child(5) { max-width: min(19rem, 80%); margin-left: 2.5rem; }
.escriben__hilo > :nth-child(7) { max-width: min(14rem, 70%); }

@media (min-width: 64rem) {
  .escriben__rejilla {
    grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
    gap: 4rem;
  }

  .escriben__cabeza {
    position: sticky;
    top: 2rem;
    align-self: start;
  }
}
</style>
