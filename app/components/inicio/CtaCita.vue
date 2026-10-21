<script setup lang="ts">
/** Versión corta del agendador: motivo + día, y lleva a /cita con eso prellenado. */
import { site } from '~/config/site'
import { tratamientos } from '~/data/tratamientos'
import { proximosDias, type DiaAgenda } from '~/utils/agenda'

const motivo = ref('valoracion')
const fecha = ref<string | null>(null)
const dias = ref<DiaAgenda[]>([])

onMounted(() => {
  dias.value = proximosDias(new Date(), site.horario, 10).filter(d => !d.cerrado).slice(0, 6)
})

const diaCorto = (d: DiaAgenda) => d.fecha.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', '')
const query = computed(() => ({ motivo: motivo.value, ...(fecha.value ? { fecha: fecha.value } : {}) }))
</script>

<template>
  <section class="cta" aria-labelledby="cta-titulo">
    <div class="contenedor cta__caja">
      <p class="seccion-num"><span>Agenda</span></p>
      <UiTarjetaCita etiqueta="Tarjeta de cita" folio="nueva" class="cta__tarjeta">
        <h2 id="cta-titulo" class="cta__titulo">¿Cuándo te vemos?</h2>
        <form class="cta__form" @submit.prevent="navigateTo({ path: '/cita', query })">
          <label class="cta__campo">
            <span class="etiqueta">Motivo</span>
            <select v-model="motivo" class="cta__select">
              <option value="valoracion">Valoración (primera vez)</option>
              <option v-for="t in tratamientos" :key="t.slug" :value="t.slug">{{ t.nombre }}</option>
              <option value="urgencia">Urgencia o dolor</option>
            </select>
          </label>
          <fieldset class="cta__campo">
            <legend class="etiqueta">Día</legend>
            <div class="cta__dias">
              <template v-if="dias.length">
                <label v-for="d in dias" :key="d.iso" class="cta__dia" :class="{ 'is-elegido': fecha === d.iso }">
                  <input v-model="fecha" type="radio" name="cta-dia" :value="d.iso" class="sr-only">
                  <span class="etiqueta">{{ diaCorto(d) }}</span>
                  <span class="cta__num">{{ d.fecha.getDate() }}</span>
                </label>
              </template>
              <span v-else class="cta__cargando etiqueta">Calculando días…</span>
            </div>
          </fieldset>
          <button type="submit" class="boton boton--primario cta__boton">Ver horarios disponibles</button>
        </form>
        <p class="cta__nota">Te pedimos tus datos en el siguiente paso. Nada se envía hasta que confirmes.</p>
      </UiTarjetaCita>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  padding-block: clamp(4rem, 9vw, 7rem) 2rem;
  overflow: hidden;
}

.cta__caja {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 1.5rem;
}

.cta__tarjeta {
  width: min(38rem, 100%);
}

.cta__titulo {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  padding-top: 0.4rem;
}

.cta__form {
  display: grid;
  gap: 1.1rem;
  margin-top: 1.1rem;
}

.cta__campo {
  display: grid;
  gap: 0.35rem;
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.cta__campo legend {
  margin-bottom: 0.35rem;
}

.cta__select {
  min-height: 3rem;
  padding: 0 0.75rem;
  border: 1px solid var(--color-linea-fuerte);
  border-radius: var(--radius-recto);
  background: var(--color-blanco);
}

.cta__dias {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  min-height: 4rem;
}

.cta__dia {
  display: grid;
  justify-items: center;
  align-content: center;
  width: 3.4rem;
  min-height: 4rem;
  border: 1px solid var(--color-linea);
  border-radius: 10px;
  background: var(--color-blanco);
  cursor: pointer;
  transition: translate 0.15s;
}

.cta__dia:hover {
  translate: 0 -2px;
}

.cta__dia.is-elegido {
  background: var(--color-petroleo);
  color: var(--color-blanco);
}

.cta__dia:has(input:focus-visible) {
  outline: 2.5px solid var(--color-petroleo-oscuro);
  outline-offset: 2px;
}

.cta__num {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  line-height: 1;
}

.cta__cargando {
  align-self: center;
  color: var(--color-tinta-suave);
}

.cta__boton {
  justify-self: start;
}

.cta__nota {
  margin-top: 0.9rem;
  font-size: var(--text-chico);
  color: var(--color-tinta-suave);
}
</style>
