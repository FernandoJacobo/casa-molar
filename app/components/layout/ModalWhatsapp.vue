<script setup lang="ts">
/**
 * "Vista previa del mensaje": en modo demo los botones de WhatsApp muestran el texto aquí en lugar
 * de abrir wa.me. Usa <dialog> nativo (atrapa el foco y cierra con Escape).
 */
const { vista, cerrar } = useWhatsapp()
const dialogo = ref<HTMLDialogElement | null>(null)
const copiado = ref(false)

watch(vista, (v) => {
  const d = dialogo.value
  if (!d) return
  if (v && !d.open) {
    copiado.value = false
    d.showModal()
  }
  else if (!v && d.open) d.close()
})

/** Convierte *negritas* de WhatsApp en <strong> para la vista previa (escapando el resto). */
const lineas = computed(() =>
  (vista.value?.texto ?? '').split('\n').map(l =>
    l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*([^*]+)\*/g, '<strong>$1</strong>'),
  ),
)

async function copiar() {
  try {
    await navigator.clipboard.writeText(vista.value?.texto ?? '')
    copiado.value = true
  }
  catch {
    copiado.value = false
  }
}

function alClicFuera(e: MouseEvent) {
  if (e.target === dialogo.value) cerrar()
}
</script>

<template>
  <dialog ref="dialogo" class="modal" aria-labelledby="modal-wa-titulo" @close="cerrar" @click="alClicFuera">
    <div class="modal__hoja">
      <p class="etiqueta modal__modo">Modo demo</p>
      <h2 id="modal-wa-titulo" class="modal__titulo">{{ vista?.titulo ?? 'Vista previa del mensaje' }}</h2>
      <div class="modal__burbuja">
        <p v-for="(l, i) in lineas" :key="i" v-html="l || '&nbsp;'" />
      </div>
      <p class="modal__nota">En un sitio real, esto se enviaría por WhatsApp a la clínica. Aquí no se envía nada.</p>
      <div class="modal__acciones">
        <button type="button" class="boton boton--claro" @click="copiar">{{ copiado ? 'Copiado' : 'Copiar texto' }}</button>
        <button type="button" class="boton" autofocus @click="cerrar">Entendido</button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.modal {
  width: min(32rem, 100% - 2rem);
  max-height: calc(100dvh - 2rem);
  padding: 0;
  border: 1px solid var(--color-linea);
  border-radius: var(--radius-tarjeta);
  background: var(--color-blanco);
  color: var(--color-tinta);
  box-shadow: var(--shadow-suave);
}

.modal::backdrop {
  background: rgb(15 42 49 / 0.5);
}

.modal__hoja {
  padding: 1.5rem;
}

.modal__modo {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  background: var(--color-menta);
  border: 1px solid var(--color-tinta);
}

.modal__titulo {
  font-size: 1.8rem;
  margin-top: 0.6rem;
}

.modal__burbuja {
  margin-top: 1rem;
  padding: 0.9rem 1rem;
  background: var(--color-niebla);
  border: 1px solid var(--color-linea);
  border-radius: 14px 14px 3px 14px;
  font-size: 0.95rem;
  line-height: 1.45;
  max-height: 45dvh;
  overflow-y: auto;
  overflow-wrap: anywhere;
}

.modal__nota {
  margin-top: 0.9rem;
  font-size: var(--text-chico);
  color: var(--color-tinta-suave);
}

.modal__acciones {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.25rem;
}
</style>
