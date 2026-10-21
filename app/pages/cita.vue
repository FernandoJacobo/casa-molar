<script setup lang="ts">
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { site } from '~/config/site'
import { equipo, profesionalPorId } from '~/data/equipo'
import { tratamientos, tratamientoPorSlug } from '~/data/tratamientos'
import { hash, horariosDisponibles, proximosDias, type DiaAgenda, type HorarioDisponible } from '~/utils/agenda'
import { desdeISO, duracionLegible, fechaISO, horaLegible } from '~/utils/formato'
import { momentoEnClinica } from '~/utils/horario'
import { crearIcs } from '~/utils/ics'
import { armarMensaje } from '~/utils/whatsapp'
import type { Cita } from '~/composables/useCitas'

useSeoPagina('Agenda tu cita', 'Agenda en línea con horarios disponibles reales de la clínica (demo): elige motivo, profesional, día y hora. Descarga tu cita para el calendario.')

const route = useRoute()
const { enviar } = useWhatsapp()
const { citas, guardar, cancelar } = useCitas()

/* ---------- Motivo y duración ---------- */
interface Motivo { valor: string; texto: string; minutos: number; tratamiento?: string }
const MOTIVOS: Motivo[] = [
  { valor: 'valoracion', texto: 'Valoración (primera vez)', minutos: 45 },
  ...tratamientos.map(t => ({ valor: t.slug, texto: t.nombre, minutos: t.minutosCita, tratamiento: t.slug })),
  { valor: 'plan', texto: 'Revisar mi plan de tratamiento', minutos: 45 },
  { valor: 'urgencia', texto: 'Urgencia o dolor', minutos: 30 },
]

const q = (k: string) => (typeof route.query[k] === 'string' ? (route.query[k] as string) : '')
const motivo = ref(MOTIVOS.some(m => m.valor === q('motivo')) ? q('motivo') : 'valoracion')
const piezaQuery = Number(q('pieza')) || null
const planQuery = q('plan')
const m = computed(() => MOTIVOS.find(x => x.valor === motivo.value)!)

/* ---------- Profesional ---------- */
const profesional = ref<string>(profesionalPorId(q('profesional')) ? q('profesional') : 'cualquiera')
const profesionalesMotivo = computed(() => equipo.filter(p => !m.value.tratamiento || p.tratamientos.includes(m.value.tratamiento)))
watch(motivo, () => {
  if (profesional.value !== 'cualquiera' && !profesionalesMotivo.value.some(p => p.id === profesional.value)) profesional.value = 'cualquiera'
})

/* ---------- Calendario (solo en el navegador: depende de la fecha de hoy) ---------- */
const hoy = ref<Date | null>(null)
const ahora = ref<{ iso: string; minutos: number } | null>(null)
onMounted(() => {
  const d = new Date()
  hoy.value = d
  ahora.value = { iso: fechaISO(d), minutos: momentoEnClinica(d, site.zonaHoraria).minutos }
  const f = q('fecha')
  if (f && dias.value.some(x => x.iso === f && !x.cerrado)) fecha.value = f
})

const dias = computed<DiaAgenda[]>(() => (hoy.value ? proximosDias(hoy.value, site.horario, 21) : []))
/** Celdas vacías antes del primer día (semana de lunes a domingo). */
const huecos = computed(() => (dias.value[0] ? (dias.value[0].dia + 6) % 7 : 0))

const fecha = ref<string | null>(null)
const hora = ref<string | null>(null)

function consultar(iso: string): HorarioDisponible[] {
  return horariosDisponibles({
    iso,
    horario: site.horario,
    equipo,
    duracion: m.value.minutos,
    tratamiento: m.value.tratamiento,
    profesional: profesional.value === 'cualquiera' ? null : profesional.value,
    ahoraMinutos: ahora.value?.iso === iso ? ahora.value.minutos : undefined,
    anticipacion: 60,
  })
}

const disponibilidad = computed(() => new Map(dias.value.map(d => [d.iso, d.cerrado ? 0 : consultar(d.iso).length])))
const horarios = computed(() => (fecha.value ? consultar(fecha.value) : []))
const manana = computed(() => horarios.value.filter(h => h.hora < '14:00'))
const tarde = computed(() => horarios.value.filter(h => h.hora >= '14:00'))

watch([motivo, profesional], () => {
  if (fecha.value && !disponibilidad.value.get(fecha.value)) fecha.value = null
  if (hora.value && !horarios.value.some(h => h.hora === hora.value)) hora.value = null
})
watch(fecha, () => (hora.value = null))

const fechaLarga = (iso: string) => format(desdeISO(iso), "EEEE d 'de' MMMM", { locale: es })
const mesDe = (d: DiaAgenda) => format(d.fecha, 'MMM', { locale: es }).replace('.', '')

/* ---------- Datos del paciente ---------- */
const nombre = ref('')
const telefono = ref('')
const correo = ref('')
const notas = ref(piezaQuery ? `Quiero revisar la pieza ${piezaQuery}.` : planQuery ? `Plan: ${planQuery.split(',').map(s => tratamientoPorSlug(s)?.nombre).filter(Boolean).join(', ')}.` : '')
const tocado = reactive({ nombre: false, telefono: false, correo: false })

const errores = computed(() => ({
  nombre: nombre.value.trim().length < 3 ? 'Escribe tu nombre (al menos 3 letras).' : '',
  telefono: telefono.value.replace(/\D/g, '').length !== 10 ? 'El teléfono debe tener 10 dígitos.' : '',
  correo: correo.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value) ? 'Revisa el correo (o déjalo vacío).' : '',
}))
const valido = computed(() => !errores.value.nombre && !errores.value.telefono && !errores.value.correo && !!fecha.value && !!hora.value)
const intento = ref(false)
const ver = (k: keyof typeof tocado) => (tocado[k] || intento.value) && errores.value[k]

/* ---------- Confirmación ---------- */
const confirmada = ref<Cita | null>(null)
const reagendando = ref<string | null>(null)

function confirmar() {
  intento.value = true
  if (!valido.value) {
    nextTick(() => document.querySelector<HTMLElement>('.campo--error input, .paso--pendiente')?.focus())
    return
  }
  const slot = horarios.value.find(h => h.hora === hora.value)!
  const pro = profesional.value === 'cualquiera' ? slot.profesionales[0]! : profesional.value
  const creada = new Date().toISOString()
  const folio = reagendando.value ?? `CM-${hash(`${fecha.value}${hora.value}${nombre.value}${creada}`).toString(36).toUpperCase().slice(0, 6)}`
  const cita: Cita = {
    folio,
    motivo: motivo.value,
    motivoTexto: m.value.texto,
    profesionalId: pro,
    fecha: fecha.value!,
    hora: hora.value!,
    duracion: m.value.minutos,
    nombre: nombre.value.trim(),
    telefono: telefono.value.replace(/\D/g, ''),
    correo: correo.value.trim(),
    notas: notas.value.trim(),
    pieza: piezaQuery,
    creada,
  }
  guardar(cita)
  confirmada.value = cita
  reagendando.value = null
  nextTick(() => document.getElementById('confirmacion')?.focus())
}

const direccion = `${site.direccion.calle}, ${site.direccion.colonia}, ${site.direccion.ciudad}, ${site.direccion.estado}`

function descargarIcs(c: Cita) {
  const pro = profesionalPorId(c.profesionalId)
  const ics = crearIcs({
    uid: `${c.folio}@casa-molar.demo`,
    fecha: c.fecha,
    hora: c.hora,
    duracionMin: c.duracion,
    titulo: `Cita en ${site.nombre}: ${c.motivoTexto}`,
    descripcion: `Folio ${c.folio}\nCon ${pro?.nombre ?? 'el equipo'}\nTeléfono: ${site.telefono.visible}\n(Cita de demostración)`,
    lugar: direccion,
    utcOffsetHoras: site.utcOffsetHoras,
    creado: new Date(c.creada),
  })
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `cita-${c.folio}.ics` })
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function mensajeCita(c: Cita) {
  return armarMensaje(`Hola, agendé una cita (folio ${c.folio})`, [
    ['Motivo', c.motivoTexto],
    ['Fecha', fechaLarga(c.fecha)],
    ['Hora', horaLegible(c.hora)],
    ['Con', profesionalPorId(c.profesionalId)?.nombre],
    ['Nombre', c.nombre],
    ['Teléfono', c.telefono],
    ['Pieza', c.pieza],
    ['Notas', c.notas],
  ])
}

function reagendar(c: Cita) {
  reagendando.value = c.folio
  confirmada.value = null
  motivo.value = MOTIVOS.some(x => x.valor === c.motivo) ? c.motivo : 'valoracion'
  profesional.value = c.profesionalId
  nombre.value = c.nombre
  telefono.value = c.telefono
  correo.value = c.correo
  notas.value = c.notas
  fecha.value = null
  nextTick(() => document.getElementById('paso-fecha')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function cancelarCita(c: Cita) {
  cancelar(c.folio)
  if (confirmada.value?.folio === c.folio) confirmada.value = null
}

function nuevaCita() {
  confirmada.value = null
  fecha.value = null
  hora.value = null
  intento.value = false
}
</script>

<template>
  <div class="cita contenedor">
    <header class="cita__cabeza">
      <UiCabezaSeccion as="h1" num="23" rotulo="Agenda" titulo="Agenda tu cita.">
        Los horarios que ves son los que de verdad quedan libres: horario de la clínica, menos la comida, menos las citas que ya hay, según lo que dura tu cita.
      </UiCabezaSeccion>
      <p class="cita__demo etiqueta">Demo: las citas solo se guardan en este navegador. Nadie recibe nada.</p>
    </header>

    <div class="cita__rejilla">
      <div class="cita__principal">
        <!-- Confirmación -->
        <div v-if="confirmada" id="confirmacion" class="conf" tabindex="-1" aria-live="polite">
          <UiTarjetaCita etiqueta="Tarjeta de cita" :folio="confirmada.folio" :giro="-1.5" class="conf__tarjeta">
            <p class="conf__hola">Listo, {{ confirmada.nombre.split(' ')[0] }}.</p>
            <dl class="conf__datos">
              <div><dt class="etiqueta">Día</dt><dd>{{ fechaLarga(confirmada.fecha) }}</dd></div>
              <div><dt class="etiqueta">Hora</dt><dd>{{ horaLegible(confirmada.hora) }} <small>· {{ duracionLegible(confirmada.duracion) }}</small></dd></div>
              <div><dt class="etiqueta">Con</dt><dd>{{ profesionalPorId(confirmada.profesionalId)?.nombre }}</dd></div>
              <div><dt class="etiqueta">Motivo</dt><dd>{{ confirmada.motivoTexto }}<template v-if="confirmada.pieza"> · pieza {{ confirmada.pieza }}</template></dd></div>
            </dl>
            <p class="conf__nota">Llega 10 minutos antes. Si no puedes venir, avísanos o reagenda aquí.</p>
          </UiTarjetaCita>
          <div class="conf__acciones">
            <button type="button" class="boton boton--coral" @click="descargarIcs(confirmada)">Descargar para mi calendario (.ics)</button>
            <button type="button" class="boton boton--claro" @click="enviar(mensajeCita(confirmada), 'Vista previa: tu cita por WhatsApp')">Enviar por WhatsApp</button>
            <button type="button" class="enlace conf__otra" @click="nuevaCita">Agendar otra cita</button>
          </div>
        </div>

        <!-- Agendador -->
        <form v-else class="agenda" novalidate @submit.prevent="confirmar">
          <p v-if="reagendando" class="agenda__reagenda etiqueta">Reagendando la cita {{ reagendando }}: elige nuevo día y hora.</p>

          <fieldset class="paso">
            <legend class="paso__titulo"><span class="mono">01</span> Motivo</legend>
            <label class="campo">
              <span class="sr-only">Motivo de la cita</span>
              <select v-model="motivo" class="campo__control">
                <option v-for="x in MOTIVOS" :key="x.valor" :value="x.valor">{{ x.texto }} · {{ duracionLegible(x.minutos) }}</option>
              </select>
            </label>
            <p v-if="piezaQuery" class="paso__nota">Vienes del odontograma: anotamos la pieza <b class="mono">{{ piezaQuery }}</b>.</p>
          </fieldset>

          <fieldset class="paso">
            <legend class="paso__titulo"><span class="mono">02</span> Quién te atiende</legend>
            <div class="profes">
              <label class="profe" :class="{ 'is-elegido': profesional === 'cualquiera' }">
                <input v-model="profesional" type="radio" name="profesional" value="cualquiera" class="sr-only">
                <span class="profe__nombre">Cualquiera</span>
                <span class="etiqueta">más horarios</span>
              </label>
              <label v-for="p in profesionalesMotivo" :key="p.id" class="profe" :class="{ 'is-elegido': profesional === p.id }">
                <input v-model="profesional" type="radio" name="profesional" :value="p.id" class="sr-only">
                <SvgAvatarSvg :avatar="p.avatar" class="profe__avatar" />
                <span class="profe__nombre">{{ p.trato }}</span>
                <span class="etiqueta">{{ p.rol.split(' · ')[0] }}</span>
              </label>
            </div>
          </fieldset>

          <fieldset id="paso-fecha" class="paso" :class="{ 'paso--pendiente': intento && !fecha }" tabindex="-1">
            <legend class="paso__titulo"><span class="mono">03</span> Día <small>próximos 21 días</small></legend>
            <div v-if="dias.length" class="cal">
              <span v-for="d in ['L', 'M', 'M', 'J', 'V', 'S', 'D']" :key="d + Math.random()" class="cal__dow etiqueta" aria-hidden="true">{{ d }}</span>
              <span v-for="i in huecos" :key="`h${i}`" aria-hidden="true" />
              <button
                v-for="d in dias"
                :key="d.iso"
                type="button"
                class="cal__dia"
                :class="{ 'is-elegido': fecha === d.iso, 'is-lleno': !d.cerrado && !disponibilidad.get(d.iso) }"
                :disabled="d.cerrado || !disponibilidad.get(d.iso)"
                :aria-pressed="fecha === d.iso"
                :aria-label="`${fechaLarga(d.iso)}: ${d.cerrado ? 'cerrado' : disponibilidad.get(d.iso) ? `${disponibilidad.get(d.iso)} horarios` : 'sin horarios'}`"
                @click="fecha = d.iso"
              >
                <span class="cal__num">{{ d.fecha.getDate() }}</span>
                <span class="cal__mes mono">{{ d.fecha.getDate() === 1 || d === dias[0] ? mesDe(d) : '' }}</span>
                <span class="cal__libres mono" aria-hidden="true">{{ d.cerrado ? 'cerr.' : disponibilidad.get(d.iso) || 'lleno' }}</span>
              </button>
            </div>
            <p v-else class="paso__nota">Cargando calendario…</p>
            <p v-if="intento && !fecha" class="campo__error">Elige un día.</p>
          </fieldset>

          <fieldset class="paso" :class="{ 'paso--pendiente': intento && fecha && !hora }">
            <legend class="paso__titulo"><span class="mono">04</span> Hora</legend>
            <p v-if="!fecha" class="paso__nota">Primero elige un día.</p>
            <template v-else>
              <p class="paso__nota">{{ fechaLarga(fecha) }} · {{ horarios.length }} horarios para {{ duracionLegible(m.minutos) }}</p>
              <div v-for="bloque in [{ t: 'Mañana', h: manana }, { t: 'Tarde', h: tarde }]" :key="bloque.t" class="horas">
                <template v-if="bloque.h.length">
                  <p class="etiqueta horas__titulo">{{ bloque.t }}</p>
                  <div class="horas__lista">
                    <label v-for="h in bloque.h" :key="h.hora" class="hora" :class="{ 'is-elegida': hora === h.hora }">
                      <input v-model="hora" type="radio" name="hora" :value="h.hora" class="sr-only">
                      <span class="mono">{{ horaLegible(h.hora) }}</span>
                    </label>
                  </div>
                </template>
              </div>
              <p v-if="intento && !hora" class="campo__error">Elige una hora.</p>
            </template>
          </fieldset>

          <fieldset class="paso">
            <legend class="paso__titulo"><span class="mono">05</span> Tus datos</legend>
            <div class="datos">
              <label class="campo" :class="{ 'campo--error': ver('nombre') }">
                <span class="etiqueta">Nombre</span>
                <input v-model="nombre" class="campo__control" autocomplete="name" :aria-invalid="!!ver('nombre')" aria-describedby="err-nombre" @blur="tocado.nombre = true">
                <span id="err-nombre" class="campo__error" aria-live="polite">{{ ver('nombre') || '' }}</span>
              </label>
              <label class="campo" :class="{ 'campo--error': ver('telefono') }">
                <span class="etiqueta">Teléfono (10 dígitos)</span>
                <input v-model="telefono" class="campo__control mono" type="tel" inputmode="tel" autocomplete="tel-national" :aria-invalid="!!ver('telefono')" aria-describedby="err-tel" @blur="tocado.telefono = true">
                <span id="err-tel" class="campo__error" aria-live="polite">{{ ver('telefono') || '' }}</span>
              </label>
              <label class="campo" :class="{ 'campo--error': ver('correo') }">
                <span class="etiqueta">Correo (opcional)</span>
                <input v-model="correo" class="campo__control" type="email" autocomplete="email" :aria-invalid="!!ver('correo')" aria-describedby="err-correo" @blur="tocado.correo = true">
                <span id="err-correo" class="campo__error" aria-live="polite">{{ ver('correo') || '' }}</span>
              </label>
              <label class="campo campo--ancho">
                <span class="etiqueta">¿Algo que debamos saber? (opcional)</span>
                <textarea v-model="notas" class="campo__control" rows="3" placeholder="Me da miedo la anestesia, tomo anticoagulantes, vengo con mi hija…" />
              </label>
            </div>
          </fieldset>

          <div class="agenda__resumen">
            <p v-if="fecha && hora" class="agenda__elegido">
              <b>{{ fechaLarga(fecha) }}, {{ horaLegible(hora) }}</b> · {{ m.texto }}
            </p>
            <button type="submit" class="boton boton--coral">{{ reagendando ? 'Confirmar nuevo horario' : 'Confirmar cita' }}</button>
          </div>
        </form>

        <!-- Mis citas -->
        <section v-if="citas.length" class="mis" aria-labelledby="mis-titulo">
          <h2 id="mis-titulo" class="h3">Tus citas en este navegador</h2>
          <ul class="mis__lista">
            <li v-for="c in citas" :key="c.folio" class="mis__cita">
              <span class="mono mis__folio">{{ c.folio }}</span>
              <span class="mis__cuando"><b>{{ fechaLarga(c.fecha) }}</b>, {{ horaLegible(c.hora) }}<br><small>{{ c.motivoTexto }} · {{ profesionalPorId(c.profesionalId)?.trato }}</small></span>
              <span class="mis__acciones">
                <button type="button" class="enlace" @click="descargarIcs(c)">.ics</button>
                <button type="button" class="enlace" @click="reagendar(c)">Reagendar</button>
                <button type="button" class="enlace mis__cancelar" @click="cancelarCita(c)">Cancelar</button>
              </span>
            </li>
          </ul>
        </section>
      </div>

      <aside class="lado" aria-label="Horario y ubicación">
        <div class="lado__bloque">
          <h2 class="etiqueta lado__titulo">Horario</h2>
          <dl class="lado__horario">
            <div v-for="h in site.horarioTexto" :key="h.dias"><dt>{{ h.dias }}</dt><dd class="mono">{{ h.horas }}</dd></div>
          </dl>
        </div>
        <div class="lado__bloque lado__urgencias">
          <h2 class="etiqueta lado__titulo">¿Te duele ahora?</h2>
          <p>Llama, no esperes a la cita:</p>
          <a :href="`tel:${site.urgencias.enlace}`" class="lado__tel">{{ site.urgencias.visible }}</a>
        </div>
        <div class="lado__bloque">
          <h2 class="etiqueta lado__titulo">Cómo llegar</h2>
          <SvgMapaIlustrado class="lado__mapa" />
          <p class="lado__dir">{{ site.direccion.calle }}, {{ site.direccion.colonia }}, {{ site.direccion.ciudad }}. {{ site.direccion.referencia }}</p>
          <ul class="lado__llegar">
            <li v-for="c in site.direccion.comoLlegar" :key="c.modo"><span class="etiqueta">{{ c.modo }}</span> {{ c.texto }}</li>
          </ul>
        </div>
        <SvgSillonSvg class="lado__sillon" />
      </aside>
    </div>
  </div>
</template>

<style scoped>
.cita {
  padding-block: clamp(2rem, 5vw, 4rem);
}

.cita__demo {
  margin-top: 1rem;
  color: var(--color-coral-oscuro);
  text-transform: none;
  letter-spacing: 0.02em;
}

.cita__rejilla {
  display: grid;
  gap: 3rem;
  margin-top: clamp(2rem, 5vw, 3rem);
}

.agenda {
  display: grid;
  gap: 0;
  border: 1.5px solid var(--color-tinta);
  background: #FBF6EC;
  box-shadow: var(--shadow-carton);
}

.agenda__reagenda {
  padding: 0.8rem 1.25rem;
  background: var(--color-menta);
  border-bottom: 1.5px solid var(--color-tinta);
}

.paso {
  margin: 0;
  padding: 1.25rem 1.25rem 1.5rem;
  border: 0;
  border-bottom: 1px dashed var(--color-arena-oscura);
  min-width: 0;
}

.paso:focus {
  outline: none;
}

.paso--pendiente {
  background: rgb(226 103 77 / 0.08);
}

.paso__titulo {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  float: left;
  width: 100%;
  margin-bottom: 0.9rem;
  font-family: var(--font-serif);
  font-size: 1.45rem;
}

.paso__titulo + * {
  clear: both;
}

.paso__titulo .mono {
  font-size: 0.78rem;
  color: var(--color-coral-oscuro);
}

.paso__titulo small {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-tinta-suave);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.paso__nota {
  clear: both;
  font-size: 0.95rem;
  color: var(--color-tinta-suave);
}

.paso__nota:not(:first-child) {
  margin-top: 0.6rem;
}

.campo {
  display: grid;
  gap: 0.3rem;
  clear: both;
}

.campo__control {
  width: 100%;
  min-height: 3rem;
  padding: 0.55rem 0.75rem;
  border: 1.5px solid var(--color-tinta);
  border-radius: var(--radius-recto);
  background: var(--color-marfil);
}

textarea.campo__control {
  resize: vertical;
  line-height: 1.5;
}

.campo__control:focus-visible {
  outline: 2.5px solid var(--color-coral-oscuro);
  outline-offset: 1px;
}

.campo--error .campo__control {
  border-color: var(--color-coral-oscuro);
  border-width: 2px;
}

.campo__error {
  min-height: 1.2em;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-coral-oscuro);
}

.profes {
  clear: both;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.profe {
  display: grid;
  justify-items: center;
  align-content: end;
  gap: 0.2rem;
  width: 7rem;
  min-height: 7.5rem;
  padding: 0.6rem 0.4rem;
  border: 1.5px solid var(--color-tinta);
  border-radius: 2px 2px 30% 30% / 2px 2px 14% 14%;
  background: var(--color-marfil);
  text-align: center;
  cursor: pointer;
}

.profe .etiqueta {
  font-size: 0.6rem;
  color: var(--color-tinta-suave);
}

.profe__avatar {
  width: 3.2rem;
}

.profe__nombre {
  font-weight: 700;
  font-size: 0.92rem;
  line-height: 1.15;
}

.profe.is-elegido {
  background: var(--color-menta);
  box-shadow: inset 0 0 0 1.5px var(--color-tinta);
}

.profe:has(input:focus-visible),
.hora:has(input:focus-visible) {
  outline: 2.5px solid var(--color-coral-oscuro);
  outline-offset: 2px;
}

.cal {
  clear: both;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.3rem;
}

.cal__dow {
  text-align: center;
  color: var(--color-tinta-suave);
  padding-bottom: 0.2rem;
}

.cal__dia {
  position: relative;
  display: grid;
  justify-items: center;
  align-content: center;
  min-height: 3.6rem;
  padding: 0.25rem 0;
  border: 1.5px solid var(--color-tinta);
  border-radius: var(--radius-recto);
  background: var(--color-marfil);
  transition: translate 0.12s;
}

.cal__dia:hover:not(:disabled) {
  translate: 0 -2px;
}

.cal__num {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  line-height: 1;
}

.cal__mes {
  position: absolute;
  top: 0.15rem;
  left: 0.25rem;
  font-size: 0.55rem;
  text-transform: uppercase;
  color: var(--color-coral-oscuro);
}

.cal__libres {
  font-size: 0.6rem;
  color: var(--color-tinta-suave);
}

.cal__dia:disabled {
  cursor: not-allowed;
  background: repeating-linear-gradient(135deg, transparent 0 5px, rgb(168 148 108 / 0.35) 5px 6px);
  border-color: var(--color-arena-oscura);
  color: var(--color-tinta-suave);
}

.cal__dia.is-elegido {
  background: var(--color-tinta);
  color: var(--color-marfil);
}

.cal__dia.is-elegido .cal__libres,
.cal__dia.is-elegido .cal__mes {
  color: var(--color-arena);
}

.horas {
  margin-top: 0.8rem;
}

.horas__titulo {
  margin-bottom: 0.4rem;
  color: var(--color-tinta-suave);
}

.horas__lista {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.hora {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0 0.75rem;
  border: 1.5px solid var(--color-tinta);
  border-radius: 1px 1px 12px 12px;
  background: var(--color-marfil);
  font-size: 0.88rem;
  cursor: pointer;
}

.hora.is-elegida {
  background: var(--color-coral);
}

.datos {
  clear: both;
  display: grid;
  gap: 0.6rem 1rem;
}

.agenda__resumen {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
}

.agenda__elegido {
  font-size: 0.98rem;
}

.conf {
  display: grid;
  gap: 1.5rem;
}

.conf:focus {
  outline: none;
}

.conf__tarjeta {
  max-width: 34rem;
}

.conf__hola {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 2.8rem);
  padding-top: 0.3rem;
}

.conf__datos div {
  display: grid;
  grid-template-columns: 5rem 1fr;
  align-items: baseline;
  min-height: 2rem;
}

.conf__datos dd {
  font-size: 1.1rem;
}

.conf__datos dd::first-letter {
  text-transform: uppercase;
}

.conf__nota {
  margin-top: 0.4rem;
  line-height: 2rem;
  font-size: 0.92rem;
  color: var(--color-tinta-suave);
}

.conf__acciones {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem 1.2rem;
}

.conf__otra,
.mis__acciones button {
  border: 0;
  background: none;
  padding: 0.5rem 0;
  min-height: 2.75rem;
}

.mis {
  margin-top: 3rem;
}

.mis__lista {
  margin-top: 1rem;
  border-top: 1.5px solid var(--color-tinta);
}

.mis__cita {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.25rem 1rem;
  align-items: center;
  padding-block: 0.75rem;
  border-bottom: 1px solid var(--color-tinta);
}

.mis__folio {
  font-size: 0.78rem;
  color: var(--color-coral-oscuro);
}

.mis__cuando b::first-letter {
  text-transform: uppercase;
}

.mis__acciones {
  grid-column: 1 / -1;
  display: flex;
  gap: 1.2rem;
}

.mis__cancelar {
  color: var(--color-coral-oscuro);
}

.lado {
  display: grid;
  gap: 2rem;
  align-content: start;
}

.lado__titulo {
  color: var(--color-coral-oscuro);
  margin-bottom: 0.5rem;
}

.lado__horario div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.3rem;
  border-bottom: 1px dotted var(--color-arena-oscura);
}

.lado__horario dd {
  font-size: 0.82rem;
  text-align: right;
}

.lado__urgencias {
  padding: 1rem 1.1rem;
  background: var(--color-tinta);
  color: var(--color-marfil);
}

.lado__urgencias .lado__titulo {
  color: var(--color-coral);
}

.lado__tel {
  display: inline-block;
  margin-top: 0.3rem;
  font-family: var(--font-serif);
  font-size: 2rem;
  text-decoration: underline;
  text-decoration-color: var(--color-coral);
  text-underline-offset: 0.15em;
}

.lado__mapa {
  border: 1.5px solid var(--color-tinta);
}

.lado__dir {
  margin-top: 0.6rem;
  font-size: 0.92rem;
}

.lado__llegar {
  display: grid;
  gap: 0.4rem;
  margin-top: 0.8rem;
  font-size: 0.92rem;
}

.lado__llegar .etiqueta {
  display: inline-block;
  min-width: 4.5rem;
  color: var(--color-tinta-suave);
}

.lado__sillon {
  max-width: 14rem;
  opacity: 0.9;
}

@media (min-width: 48rem) {
  .datos {
    grid-template-columns: 1fr 1fr;
  }

  .campo--ancho {
    grid-column: 1 / -1;
  }

  .mis__cita {
    grid-template-columns: 6rem 1fr auto;
  }

  .mis__acciones {
    grid-column: auto;
  }
}

@media (min-width: 64rem) {
  .cita__rejilla {
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: clamp(2.5rem, 5vw, 4.5rem);
    align-items: start;
  }

  .lado {
    position: sticky;
    top: 1.5rem;
  }
}
</style>
