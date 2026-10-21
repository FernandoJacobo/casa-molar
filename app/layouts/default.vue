<template>
  <div class="sitio">
    <a href="#contenido" class="saltar">Saltar al contenido</a>
    <SvgDientesSprite />
    <LayoutCintaSuperior />
    <LayoutEncabezadoSitio />
    <main id="contenido" tabindex="-1">
      <slot />
    </main>
    <LayoutPieSitio />
    <LayoutBarraMovil />
    <LayoutModalWhatsapp />
  </div>
</template>

<style scoped>
.saltar {
  position: absolute;
  left: 1rem;
  top: -4rem;
  z-index: 100;
  padding: 0.75rem 1rem;
  background: var(--color-tinta);
  color: var(--color-marfil);
  font-weight: 700;
  text-decoration: none;
}

.saltar:focus {
  top: 1rem;
}

main:focus {
  outline: none;
}
</style>
