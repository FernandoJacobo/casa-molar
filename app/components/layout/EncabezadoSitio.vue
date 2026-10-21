<script setup lang="ts">
const enlaces = [
  { to: '/tratamientos', codigo: '11', texto: 'Tratamientos' },
  { to: '/precios', codigo: '21', texto: 'Precios' },
  { to: '/equipo', codigo: '31', texto: 'Equipo' },
  { to: '/cepillado', codigo: '41', texto: 'Cepillado' },
]

const abierto = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (abierto.value = false))

onKeyStroke('Escape', () => (abierto.value = false))
</script>

<template>
  <header class="encabezado">
    <div class="contenedor encabezado__fila">
      <NuxtLink to="/" class="encabezado__logo" aria-label="Casa Molar, inicio">
        <LayoutLogoCasa />
      </NuxtLink>

      <nav class="encabezado__nav" aria-label="Principal">
        <ul class="encabezado__lista" :class="{ 'is-abierto': abierto }" id="menu-principal">
          <li v-for="e in enlaces" :key="e.to">
            <NuxtLink :to="e.to" class="encabezado__enlace">
              <span class="encabezado__codigo" aria-hidden="true">{{ e.codigo }}</span>
              {{ e.texto }}
            </NuxtLink>
          </li>
        </ul>
        <button
          type="button"
          class="encabezado__menu etiqueta"
          :aria-expanded="abierto"
          aria-controls="menu-principal"
          @click="abierto = !abierto"
        >
          {{ abierto ? 'Cerrar' : 'Menú' }}
        </button>
      </nav>

      <NuxtLink to="/cita" class="boton boton--coral encabezado__cta">Agendar</NuxtLink>
    </div>
  </header>
</template>

<style scoped>
.encabezado {
  position: relative;
  z-index: 30;
}

.encabezado__fila {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-block: 1rem;
}

.encabezado__logo {
  text-decoration: none;
  margin-right: auto;
  min-height: 2.75rem;
  display: flex;
  align-items: center;
}

.encabezado__lista {
  display: flex;
  gap: clamp(1rem, 2.4vw, 2.2rem);
}

.encabezado__enlace {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  min-height: 2.75rem;
  align-items: center;
  text-decoration: none;
  font-weight: 500;
}

.encabezado__codigo {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-coral-oscuro);
  translate: 0 -0.35em;
}

.encabezado__enlace:hover {
  text-decoration: underline;
  text-decoration-color: var(--color-coral);
  text-decoration-thickness: 2px;
  text-underline-offset: 0.3em;
}

.encabezado__enlace.router-link-active {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 0.3em;
}

.encabezado__menu {
  display: none;
}

.encabezado__cta {
  min-height: 2.75rem;
  padding-inline: 1.1rem;
}

@media (max-width: 47.99rem) {
  .encabezado__cta {
    display: none;
  }

  .encabezado__menu {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    min-width: 2.75rem;
    padding: 0 0.9rem;
    border: 1.5px solid var(--color-tinta);
    border-radius: var(--radius-recto);
    background: var(--color-marfil);
    font-weight: 700;
  }

  .encabezado__lista {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    padding: 0.5rem var(--margen) 1.25rem;
    background: var(--color-marfil);
    border-bottom: 1.5px solid var(--color-tinta);
  }

  .encabezado__lista.is-abierto {
    display: flex;
  }

  .encabezado__lista li + li {
    border-top: 1px dashed var(--color-arena-oscura);
  }

  .encabezado__enlace {
    width: 100%;
    font-family: var(--font-serif);
    font-size: 1.6rem;
    padding-block: 0.45rem;
    gap: 0.8rem;
  }

  .encabezado__codigo {
    font-size: 0.75rem;
    translate: 0 -0.6em;
  }
}
</style>
