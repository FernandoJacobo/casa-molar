/**
 * Datos de la clínica. TODO es ficticio (ver DATOS-FICTICIOS.md).
 * Para adaptar el demo a una clínica real se cambia este archivo y los de `app/data/`; ningún componente
 * tiene datos de la marca escritos a mano.
 */

export interface Turno {
  /** Hora de apertura en formato 24 h, "HH:mm". */
  abre: string
  cierra: string
  /** Descanso (comida) dentro del turno. */
  descanso?: { desde: string; hasta: string }
}

export const site = {
  nombre: 'Casa Molar',
  sufijo: 'Odontología',
  nombreLegal: 'Casa Molar — Odontología (demo)',
  lema: 'Cuidamos las 32.',
  descripcion:
    'Clínica dental de barrio (demo con datos ficticios): odontograma interactivo, simulador de blanqueamiento, plan de tratamiento con precios y agenda en línea.',
  url: 'https://casa-molar.pages.dev',

  /**
   * `false` mientras sea un demo: `noindex`, robots.txt con `Disallow: /`, sin sitemap ni JSON-LD.
   * Con un cliente real se cambia a `true` y se activan el sitemap y los datos estructurados.
   */
  indexable: false,

  telefono: { visible: '33 0000 0000', enlace: '+523300000000' },
  urgencias: { visible: '33 0000 0000', enlace: '+523300000000' },
  /** Placeholder: mientras sea este número, los botones de WhatsApp muestran una vista previa y no abren wa.me. */
  whatsappPlaceholder: '520000000000',
  correo: 'hola@clinica-demo.example',

  direccion: {
    calle: 'Av. Ejemplo 123',
    colonia: 'Col. Demo',
    ciudad: 'Zapopan',
    estado: 'Jalisco',
    cp: '45000',
    referencia: 'Planta baja, puerta de madera junto a la farmacia. Enfrente del Parque Demo.',
    comoLlegar: [
      { modo: 'Camión', texto: 'Ruta Demo 1: bájate en la parada "Parque Demo" y camina media cuadra.' },
      { modo: 'Auto', texto: 'Hay tres cajones para pacientes frente a la clínica y calle con parquímetro.' },
      { modo: 'Bici', texto: 'Hay un aro para amarrar la bici junto a la puerta.' },
    ],
  },

  /** Calles del mapa ilustrado (inventadas). */
  mapa: {
    avenida: 'Av. Ejemplo',
    calle1: 'C. Muestra',
    calle2: 'C. Prueba',
    calle3: 'C. Boceto',
    parque: 'Parque Demo',
  },

  /** Índice 0 = domingo (como `Date.getDay()`). `null` = cerrado. */
  horario: [
    null,
    { abre: '09:00', cierra: '19:00', descanso: { desde: '14:00', hasta: '15:00' } },
    { abre: '09:00', cierra: '19:00', descanso: { desde: '14:00', hasta: '15:00' } },
    { abre: '09:00', cierra: '19:00', descanso: { desde: '14:00', hasta: '15:00' } },
    { abre: '09:00', cierra: '19:00', descanso: { desde: '14:00', hasta: '15:00' } },
    { abre: '09:00', cierra: '19:00', descanso: { desde: '14:00', hasta: '15:00' } },
    { abre: '09:00', cierra: '14:00' },
  ] as (Turno | null)[],
  horarioTexto: [
    { dias: 'Lunes a viernes', horas: '9:00 a. m. – 7:00 p. m.', nota: 'comida de 2 a 3' },
    { dias: 'Sábado', horas: '9:00 a. m. – 2:00 p. m.' },
    { dias: 'Domingo', horas: 'Cerrado', nota: 'urgencias por teléfono' },
  ],
  zonaHoraria: 'America/Mexico_City',
  /** Diferencia fija con UTC (México centro no tiene horario de verano desde 2022). */
  utcOffsetHoras: -6,

  cedula: 'Cédula DEMO-0000000',
  responsable: 'Dra. Ifigenia Larrondo (ficticia)',

  redes: [
    { nombre: 'Instagram', href: '#' },
    { nombre: 'Facebook', href: '#' },
  ],

  financiamiento: {
    plazosSinIntereses: [3, 6, 12],
    /** Tasa anual del plan con intereses (ilustrativa). */
    tasaAnual: 0.18,
    plazosConIntereses: [18, 24],
    montoMinimo: 1500,
  },

  credito: { texto: 'Demo desarrollado por JacoboDev', url: 'https://jacobodev.pages.dev', visible: 'jacobodev.pages.dev' },
  avisoDemo:
    'Sitio de demostración. Todos los nombres, personas, teléfonos, direcciones, cédulas, precios y reseñas son ficticios.',
}

export type Site = typeof site
