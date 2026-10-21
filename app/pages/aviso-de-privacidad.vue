<script setup lang="ts">
import { site } from '~/config/site'

useSeoPagina('Aviso de privacidad', 'Aviso de privacidad de ejemplo de Casa Molar, sitio de demostración. No se recaban datos: todo se queda en tu navegador.')

const d = site.direccion
</script>

<template>
  <article class="aviso contenedor">
    <UiCabezaSeccion as="h1" num="51" rotulo="Legal" titulo="Aviso de privacidad.">
      Texto de ejemplo para un sitio de demostración. Antes de usarlo en una clínica real, revísalo con un abogado.
    </UiCabezaSeccion>

    <div class="aviso__demo">
      <p class="etiqueta">Lo importante en este demo</p>
      <p>Este sitio <b>no envía ni guarda tus datos en ningún servidor</b>. Lo que escribes al agendar o armar un plan se queda en el almacenamiento de tu navegador y puedes borrarlo cancelando la cita o limpiando los datos del sitio.</p>
    </div>

    <div class="aviso__cuerpo">
      <section>
        <h2 class="h3"><span class="mono">01</span> Responsable</h2>
        <p>{{ site.nombre }} {{ site.sufijo }} (nombre ficticio), con domicilio en {{ d.calle }}, {{ d.colonia }}, {{ d.ciudad }}, {{ d.estado }}, C.P. {{ d.cp }}, es responsable del tratamiento de tus datos personales. Responsable sanitario: {{ site.responsable }}, cédula {{ site.cedula }}.</p>
      </section>

      <section>
        <h2 class="h3"><span class="mono">02</span> Qué datos usaríamos</h2>
        <ul>
          <li>De identificación y contacto: nombre, teléfono y correo.</li>
          <li>De salud (datos sensibles): historia clínica, radiografías, odontograma, alergias y medicamentos.</li>
          <li>De facturación, si la pides.</li>
        </ul>
      </section>

      <section>
        <h2 class="h3"><span class="mono">03</span> Para qué</h2>
        <p><b>Necesarias:</b> agendar y confirmar citas, darte atención odontológica, llevar tu expediente clínico como marca la norma y cobrar.</p>
        <p><b>No necesarias:</b> recordatorios de revisión y avisos de la clínica. Puedes negarte escribiendo al correo de abajo, sin que cambie tu atención.</p>
      </section>

      <section>
        <h2 class="h3"><span class="mono">04</span> Con quién se compartirían</h2>
        <p>Solo con laboratorios dentales o especialistas que participen en tu tratamiento, y con autoridades cuando la ley lo exija. No vendemos ni rentamos datos.</p>
      </section>

      <section>
        <h2 class="h3"><span class="mono">05</span> Tus derechos (ARCO)</h2>
        <p>Puedes pedir acceso, rectificación, cancelación u oposición, y revocar tu consentimiento, escribiendo a <a class="enlace" :href="`mailto:${site.correo}`">{{ site.correo }}</a> con tu nombre, lo que solicitas y una identificación. Respondemos en un máximo de 20 días hábiles.</p>
      </section>

      <section>
        <h2 class="h3"><span class="mono">06</span> Cookies y almacenamiento local</h2>
        <p>El sitio no usa cookies de rastreo ni analítica. Usa el almacenamiento local del navegador solo para recordar tus citas, tu plan de tratamiento y el modo peques del cronómetro.</p>
      </section>

      <section>
        <h2 class="h3"><span class="mono">07</span> Cambios</h2>
        <p>Cualquier cambio a este aviso se publicaría en esta misma página.</p>
        <p class="aviso__fecha mono">Última actualización: 1 de octubre de 2026 (ejemplo)</p>
      </section>
    </div>
  </article>
</template>

<style scoped>
.aviso {
  padding-block: clamp(2rem, 5vw, 4rem) clamp(3rem, 7vw, 6rem);
}

.aviso__demo {
  max-width: 44rem;
  margin-top: 2rem;
  padding: 1.1rem 1.25rem;
  border-left: 4px solid var(--color-coral-oscuro);
  background: var(--color-hueso);
}

.aviso__demo .etiqueta {
  color: var(--color-coral-oscuro);
  margin-bottom: 0.4rem;
}

.aviso__cuerpo {
  display: grid;
  gap: 2rem;
  max-width: 44rem;
  margin-top: 3rem;
}

.aviso__cuerpo h2 {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.aviso__cuerpo h2 .mono {
  font-size: 0.75rem;
  color: var(--color-coral-oscuro);
}

.aviso__cuerpo p + p {
  margin-top: 0.6rem;
}

.aviso__cuerpo ul {
  display: grid;
  gap: 0.4rem;
  padding-left: 1.2rem;
  list-style: square;
}

.aviso__fecha {
  font-size: 0.8rem;
  color: var(--color-tinta-suave);
}
</style>
