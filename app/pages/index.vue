<script setup lang="ts">
import { tonos } from '~/data/tonos'
</script>

<template>
  <div class="contenedor" style="padding-block: 3rem; display: grid; gap: 3rem">
    <h1 style="font-size: clamp(4rem, 15vw, 13rem)">Cuidamos las 32.</h1>
    <SvgArcadaSvg destello numeros style="max-width: 40rem" />
    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap">
      <UiPestanaTono v-for="t in tonos" :key="t.codigo" :codigo="t.codigo" :hex="t.hex" />
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 50rem">
      <SvgSonrisaSvg variante="antes" tono="#D4B685" />
      <SvgSonrisaSvg variante="despues" tono="#EEE3CF" />
    </div>
    <UiTarjetaCita folio="CM-0001" :giro="-2" style="max-width: 24rem">
      <p>Agendar valoración</p>
    </UiTarjetaCita>
    <div style="display: grid; gap: 1rem">
      <UiBurbujaChat nombre="Rocío M." hora="6:12 p. m.">Llevaba 6 años sin ir.</UiBurbujaChat>
      <UiBurbujaChat nombre="Casa Molar" lado="der" :ficticia="false">Gracias.</UiBurbujaChat>
    </div>
    <button class="boton" @click="useWhatsapp().enviar('*Hola*\n\n• Prueba: sí')">Probar WhatsApp</button>
  </div>
</template>
