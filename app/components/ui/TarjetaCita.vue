<script setup lang="ts">
/**
 * Tarjeta de cita de cartón: perforación a la izquierda, folio arriba y renglones.
 * Se usa como CTA del hero, contenedor del agendador y confirmación.
 */
withDefaults(defineProps<{
  folio?: string
  /** Giro en grados (objeto apoyado sobre la mesa). */
  giro?: number
  etiqueta?: string
  as?: string
}>(), { folio: '', giro: 0, etiqueta: 'Tarjeta de cita', as: 'div' })
</script>

<template>
  <component :is="as" class="tarjeta" :style="{ '--giro': `${giro}deg` }">
    <span class="tarjeta__perforacion" aria-hidden="true" />
    <div class="tarjeta__cabeza">
      <span class="etiqueta">{{ etiqueta }}</span>
      <span v-if="folio" class="etiqueta tarjeta__folio">Folio {{ folio }}</span>
    </div>
    <div class="tarjeta__cuerpo">
      <slot />
    </div>
  </component>
</template>

<style scoped>
.tarjeta {
  --perf: 1.6rem;
  position: relative;
  display: block;
  padding: 1rem 1.25rem 1.25rem calc(var(--perf) + 1rem);
  background:
    repeating-linear-gradient(180deg, transparent 0 calc(2rem - 1px), rgb(168 148 108 / 0.35) calc(2rem - 1px) 2rem) 0 2.9rem / 100% calc(100% - 3.4rem) no-repeat,
    #FBF6EC;
  border: 1.5px solid var(--color-tinta);
  border-radius: var(--radius-tarjeta) 3px var(--radius-tarjeta) 3px;
  box-shadow: var(--shadow-carton);
  rotate: var(--giro);
  color: var(--color-tinta);
}

/* Perforación: columna de orificios y línea punteada para desprender. */
.tarjeta__perforacion {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--perf);
  border-right: 1.5px dashed var(--color-arena-oscura);
  background: radial-gradient(circle at 50% 50%, var(--color-marfil) 0 0.22rem, var(--color-tinta) 0.22rem 0.3rem, transparent 0.3rem) 0 0.4rem / 100% 1.3rem repeat-y;
}

.tarjeta__cabeza {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.55rem;
  margin-bottom: 0.4rem;
  border-bottom: 1.5px solid var(--color-tinta);
  color: var(--color-tinta-suave);
}

.tarjeta__folio {
  color: var(--color-coral-oscuro);
  font-weight: 700;
}
</style>
