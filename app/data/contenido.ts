/** Textos del inicio: reseñas (ficticias), preguntas, primera visita y tecnología. */

export interface Resena {
  nombre: string
  /** Quién "habla" en la burbuja: el paciente o la clínica respondiendo. */
  de: 'paciente' | 'clinica'
  texto: string
  hora: string
}

/** Reseñas FICTICIAS (se marcan como tales en el diseño). */
export const resenas: Resena[] = [
  { nombre: 'Rocío M.', de: 'paciente', texto: 'Llevaba 6 años sin ir al dentista por pena. Nadie me regañó. Ya agendé la siguiente limpieza.', hora: '6:12 p. m.' },
  { nombre: 'Casa Molar', de: 'clinica', texto: 'Gracias, Rocío. Nos vemos en abril para la siguiente.', hora: '6:20 p. m.' },
  { nombre: 'Julián P.', de: 'paciente', texto: 'Me explicaron la radiografía en la pantalla y entendí por fin por qué me dolía. La endodoncia no dolió.', hora: '1:47 p. m.' },
  { nombre: 'Andrea V.', de: 'paciente', texto: 'Mi hija de 4 años salió pidiendo regresar. No sé qué brujería hacen.', hora: '11:03 a. m.' },
  { nombre: 'Tomás R.', de: 'paciente', texto: 'Me dijeron que NO necesitaba carillas, que con un blanqueamiento bastaba. Primera vez que un dentista me ahorra dinero.', hora: '7:30 p. m.' },
  { nombre: 'Lupita G.', de: 'paciente', texto: 'Puntuales. Entré a la hora de mi cita.', hora: '9:58 a. m.' },
]

export interface PreguntaFrecuente {
  corta: string
  pregunta: string
  respuesta: string
  enlace?: { texto: string; to: string }
}

export const preguntas: PreguntaFrecuente[] = [
  {
    corta: '¿Duele?',
    pregunta: '¿Duele?',
    respuesta:
      'Te decimos cuándo sí y qué hacemos para que no. Una limpieza puede incomodar, no doler. Para resinas profundas, endodoncias e implantes usamos anestesia local y esperamos a que haga efecto antes de empezar. Si en algún momento sientes algo, levantas la mano y paramos.',
  },
  {
    corta: '¿Cuánto cuesta una limpieza?',
    pregunta: '¿Cuánto cuesta una limpieza?',
    respuesta: 'Desde $650 y dura unos 45 minutos. Todos los precios están publicados, no hay que pedirlos por inbox.',
    enlace: { texto: 'Ver la lista de precios', to: '/precios' },
  },
  {
    corta: '¿Y si me da pena?',
    pregunta: '¿Y si me da pena cómo tengo los dientes?',
    respuesta:
      'Es lo más común que escuchamos. Vemos bocas todo el día y ninguna nos asusta. Nadie te va a regañar por los años sin venir: vamos a ver qué hay y qué conviene hacer primero.',
  },
  {
    corta: '¿Atienden urgencias?',
    pregunta: '¿Atienden urgencias?',
    respuesta: 'Sí. Entre semana te hacemos un espacio el mismo día; en domingo, llama al teléfono de urgencias y te decimos qué hacer mientras.',
  },
  {
    corta: '¿Puedo pagar a meses?',
    pregunta: '¿Puedo pagar a meses?',
    respuesta: 'Sí, a 3, 6 o 12 meses sin intereses en tratamientos desde $1,500. Puedes simular tu mensualidad antes de venir.',
    enlace: { texto: 'Simular mensualidad', to: '/precios#financiamiento' },
  },
  {
    corta: '¿Me van a vender cosas?',
    pregunta: '¿Me van a vender cosas que no necesito?',
    respuesta: 'Si algo no lo necesitas, te lo decimos. Te damos un plan por escrito con lo urgente primero y lo opcional al final, y tú decides.',
  },
]

export interface TramoVisita {
  id: string
  titulo: string
  minutos: number
  pasa: string
  traer: string
}

export const primeraVisita: TramoVisita[] = [
  {
    id: 'platica',
    titulo: 'Plática',
    minutos: 10,
    pasa: 'Nos cuentas qué te trae, qué te preocupa y si algo te da miedo. Revisamos tu historial y medicamentos.',
    traer: 'La lista de medicamentos que tomas y, si tienes, radiografías anteriores.',
  },
  {
    id: 'revision',
    titulo: 'Revisión',
    minutos: 15,
    pasa: 'Revisamos pieza por pieza con espejo y luz, y medimos tus encías. Te vamos diciendo lo que vemos.',
    traer: 'Nada. Si usas guarda o retenedor, tráelo.',
  },
  {
    id: 'radiografia',
    titulo: 'Radiografía digital',
    minutos: 10,
    pasa: 'Si hace falta, tomamos radiografías digitales. Las ves en pantalla al momento.',
    traer: 'Avísanos si hay posibilidad de embarazo.',
  },
  {
    id: 'plan',
    titulo: 'Plan de tratamiento',
    minutos: 10,
    pasa: 'Te damos un plan por escrito: qué urge, qué puede esperar y cuánto cuesta cada cosa. Sin compromiso.',
    traer: 'Tus dudas. Aquí se resuelven todas.',
  },
]

export interface Anotacion {
  titulo: string
  texto: string
}

export const tecnologia: Anotacion[] = [
  {
    titulo: 'Radiografía digital',
    texto: 'Sale en la pantalla en segundos y usa menos radiación que la de película. La vemos juntos y te la mandamos.',
  },
  {
    titulo: 'Escáner intraoral',
    texto: 'Una cámara pequeña que toma la forma de tus dientes. Adiós a la pasta de moldes que da asco.',
  },
  {
    titulo: 'Planeación digital',
    texto: 'Antes de poner un implante o un alineador, lo planeamos en la computadora y te mostramos el resultado esperado.',
  },
]

/** Precios que no son un tratamiento con página propia. Ilustrativos. */
export const preciosExtra = [
  { nombre: 'Consulta de valoración', desde: 450, nota: 'se descuenta si inicias tratamiento', categoria: 'Prevención' as const },
  { nombre: 'Radiografía periapical digital', desde: 250, nota: 'por toma', categoria: 'Prevención' as const },
  { nombre: 'Radiografía panorámica', desde: 650, categoria: 'Prevención' as const },
  { nombre: 'Selladores de fosetas', desde: 400, nota: 'por pieza', categoria: 'Niñas y niños' as const },
  { nombre: 'Extracción simple', desde: 900, categoria: 'Cirugía e implantes' as const },
  { nombre: 'Extracción de cordal', desde: 2800, nota: 'según posición', categoria: 'Cirugía e implantes' as const },
  { nombre: 'Corona sobre diente', desde: 6200, nota: 'por pieza', categoria: 'Restauración' as const },
  { nombre: 'Guarda nocturna', desde: 2400, categoria: 'Prevención' as const },
  { nombre: 'Retenedor', desde: 1800, nota: 'por arcada', categoria: 'Ortodoncia' as const },
]
