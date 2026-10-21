/**
 * Tratamientos de la clínica. Precios ILUSTRATIVOS en MXN ("desde"), sujetos a valoración.
 * Sin marcas reales de materiales, alineadores ni implantes.
 */

export type TipoPieza = 'incisivo' | 'canino' | 'premolar' | 'molar' | 'cordal'

export interface Etapa {
  titulo: string
  texto: string
}

export interface Pregunta {
  pregunta: string
  respuesta: string
}

export interface Tratamiento {
  slug: string
  codigo: string
  nombre: string
  /** Una línea para el índice. */
  linea: string
  categoria: 'Prevención' | 'Restauración' | 'Estética' | 'Ortodoncia' | 'Cirugía e implantes' | 'Niñas y niños'
  /** Precio "desde" en MXN. */
  desde: number
  unidad: string
  /** El precio se multiplica por pieza y en el plan se eligen piezas en el odontograma. */
  porPieza: boolean
  /** Tipos de pieza en los que aplica (solo si `porPieza`). */
  aplicaA?: TipoPieza[]
  /** Citas del tratamiento: base + porPieza × piezas (redondeado hacia arriba). */
  citas: { base: number; porPieza: number }
  /** Duración de la primera cita en minutos (para el agendador). */
  minutosCita: number
  duracion: string
  enQueConsiste: string
  paraQuien: string[]
  etapas: Etapa[]
  cuidados: string[]
  preguntas: Pregunta[]
}

export const tratamientos: Tratamiento[] = [
  {
    slug: 'limpieza',
    codigo: 'T-01',
    nombre: 'Limpieza y profilaxis',
    linea: 'Ultrasonido, pulido y revisión de encías. Sales sabiendo cómo están.',
    categoria: 'Prevención',
    desde: 650,
    unidad: 'por cita',
    porPieza: false,
    citas: { base: 1, porPieza: 0 },
    minutosCita: 45,
    duracion: '45 minutos, una cita',
    enQueConsiste:
      'Quitamos el sarro con ultrasonido (vibra y hace ruido, pero no corta), pulimos para que la placa no se pegue tan rápido y revisamos tus encías pieza por pieza. Al final te decimos qué vimos, sin sustos ni ventas.',
    paraQuien: [
      'Cualquier persona, cada 6 meses.',
      'Si te sangran las encías al cepillarte.',
      'Si llevas más de un año sin limpieza (no pasa nada, es lo más común).',
    ],
    etapas: [
      { titulo: 'Revisión', texto: 'Vemos encías, sarro y manchas. Si hace falta, una radiografía.' },
      { titulo: 'Ultrasonido', texto: 'Quitamos el sarro de arriba y de abajo de la encía.' },
      { titulo: 'Pulido', texto: 'Pasta de pulir y cepillo de copa. Deja la superficie lisa.' },
      { titulo: 'Plática', texto: 'Qué zonas cuesta más limpiar y cómo cepillarlas.' },
    ],
    cuidados: [
      'Puedes comer en cuanto salgas.',
      'Si tenías mucho sarro, puede haber sensibilidad al frío un par de días.',
      'Cepillo suave y pasta para sensibilidad si la notas.',
    ],
    preguntas: [
      { pregunta: '¿La limpieza desgasta el esmalte?', respuesta: 'No. El ultrasonido retira sarro, no esmalte. Lo que sí desgasta es cepillarse con fuerza y cerdas duras.' },
      { pregunta: '¿Me van a regañar?', respuesta: 'No. Te vamos a decir qué vemos y qué te ayudaría. Regañar no limpia ningún diente.' },
    ],
  },
  {
    slug: 'resinas',
    codigo: 'T-02',
    nombre: 'Resinas (caries)',
    linea: 'Quitamos la caries y rellenamos del color de tu diente.',
    categoria: 'Restauración',
    desde: 900,
    unidad: 'por pieza',
    porPieza: true,
    aplicaA: ['incisivo', 'canino', 'premolar', 'molar', 'cordal'],
    citas: { base: 0, porPieza: 0.5 },
    minutosCita: 45,
    duracion: '30 a 50 minutos por pieza',
    enQueConsiste:
      'Retiramos la parte del diente con caries y la reconstruimos con resina de nanorelleno del mismo tono que tu diente. La resina se endurece con una luz azul en segundos y se pule para que la mordida quede pareja.',
    paraQuien: [
      'Caries pequeñas y medianas.',
      'Dientes despostillados o con desgaste.',
      'Cambiar amalgamas viejas que ya se fracturaron.',
    ],
    etapas: [
      { titulo: 'Anestesia local', texto: 'Solo si hace falta; en caries muy pequeñas a veces no.' },
      { titulo: 'Limpieza de la caries', texto: 'Quitamos lo dañado y nada más.' },
      { titulo: 'Capas de resina', texto: 'Se pone por capas y se endurece con luz.' },
      { titulo: 'Ajuste de mordida', texto: 'Muerdes un papel de color y pulimos donde marque.' },
    ],
    cuidados: [
      'Espera a que pase la anestesia para comer (unas 2 horas).',
      'Si al morder sientes que "pega" antes, avísanos: se ajusta en 5 minutos.',
      'Café, té y vino manchan menos si enjuagas con agua.',
    ],
    preguntas: [
      { pregunta: '¿Cuánto dura una resina?', respuesta: 'Depende del tamaño y de cómo muerdes. Con revisiones cada 6 meses, muchas duran varios años.' },
      { pregunta: '¿Se nota?', respuesta: 'Elegimos el tono con la guía de tonos antes de empezar. En la mayoría de los casos no se nota.' },
    ],
  },
  {
    slug: 'blanqueamiento',
    codigo: 'T-03',
    nombre: 'Blanqueamiento',
    linea: 'Unos tonos más claro, sin dejarte los dientes "de anuncio".',
    categoria: 'Estética',
    desde: 2200,
    unidad: 'por sesión',
    porPieza: false,
    citas: { base: 2, porPieza: 0 },
    minutosCita: 60,
    duracion: '60 minutos por sesión; de 1 a 4 sesiones',
    enQueConsiste:
      'Aplicamos un gel aclarante sobre tus dientes, protegiendo la encía. Medimos tu tono antes y después con la guía de tonos para que veas el cambio real, no una foto con filtro.',
    paraQuien: [
      'Dientes sanos que se oscurecieron con café, té, vino o con los años.',
      'Antes de hacer resinas o carillas en dientes de enfrente, para igualar el tono.',
      'No es para dientes con caries activa ni encías inflamadas: primero eso.',
    ],
    etapas: [
      { titulo: 'Valoración y limpieza', texto: 'Blanquear con sarro es tirar el gel.' },
      { titulo: 'Toma de tono', texto: 'Con la guía de tonos y una foto con luz controlada.' },
      { titulo: 'Sesiones', texto: 'Protegemos la encía y aplicamos el gel en ciclos.' },
      { titulo: 'Tono final', texto: 'Comparamos con la medición inicial.' },
    ],
    cuidados: [
      '48 horas sin café, vino tinto, salsas oscuras ni cigarro.',
      'Es normal sentir sensibilidad uno o dos días.',
      'Un retoque al año mantiene el tono.',
    ],
    preguntas: [
      { pregunta: '¿Daña el esmalte?', respuesta: 'Bien indicado y con las concentraciones correctas, no. Por eso lo valoramos antes.' },
      { pregunta: '¿Blanquea las resinas?', respuesta: 'No. Resinas y carillas se quedan del tono que tenían; si están en dientes de enfrente, lo platicamos antes.' },
    ],
  },
  {
    slug: 'alineadores',
    codigo: 'T-04',
    nombre: 'Alineadores transparentes',
    linea: 'Guardas transparentes que mueven los dientes poco a poco.',
    categoria: 'Ortodoncia',
    desde: 38000,
    unidad: 'tratamiento',
    porPieza: false,
    citas: { base: 10, porPieza: 0 },
    minutosCita: 60,
    duracion: 'De 8 a 18 meses, según el caso',
    enQueConsiste:
      'Escaneamos tu boca (sin moldes de pasta), planeamos el movimiento de cada pieza en la computadora y te entregamos una serie de alineadores transparentes. Cambias de juego cada una o dos semanas y vienes a revisión cada 6 a 8 semanas.',
    paraQuien: [
      'Apiñamiento leve o moderado, espacios entre dientes.',
      'Personas adultas o adolescentes que pueden usarlos 22 horas al día.',
      'Quien ya usó brackets y los dientes se le movieron.',
    ],
    etapas: [
      { titulo: 'Escaneo y fotos', texto: 'Escáner intraoral y radiografía.' },
      { titulo: 'Plan digital', texto: 'Te mostramos en pantalla cómo se moverán tus dientes.' },
      { titulo: 'Entrega', texto: 'Primeros alineadores y cómo ponértelos.' },
      { titulo: 'Revisiones', texto: 'Cada 6 a 8 semanas, hasta terminar.' },
      { titulo: 'Retención', texto: 'Retenedor para que los dientes no regresen.' },
    ],
    cuidados: [
      'Se quitan para comer y para todo lo que no sea agua.',
      'Cepíllate antes de volver a ponerlos.',
      'Lávalos con agua fría; el agua caliente los deforma.',
    ],
    preguntas: [
      { pregunta: '¿Duelen?', respuesta: 'Los primeros dos días de cada juego se sienten apretados. Es presión, no dolor fuerte.' },
      { pregunta: '¿Sirven para cualquier caso?', respuesta: 'No. Algunos casos se resuelven mejor con brackets. Te lo decimos en la valoración.' },
    ],
  },
  {
    slug: 'brackets',
    codigo: 'T-05',
    nombre: 'Brackets',
    linea: 'Ortodoncia fija, metálica o estética, con revisión cada mes.',
    categoria: 'Ortodoncia',
    desde: 18000,
    unidad: 'tratamiento',
    porPieza: false,
    citas: { base: 20, porPieza: 0 },
    minutosCita: 60,
    duracion: 'De 14 a 24 meses, una revisión al mes',
    enQueConsiste:
      'Pegamos un bracket en cada diente y los unimos con un arco de alambre. Cada mes ajustamos el arco para guiar el movimiento. Puede ser metálico o estético (del color del diente).',
    paraQuien: [
      'Apiñamiento, mordida cruzada, dientes muy girados.',
      'Casos que necesitan más control que el de un alineador.',
      'Adolescentes y personas adultas (no hay edad máxima).',
    ],
    etapas: [
      { titulo: 'Estudios', texto: 'Radiografías, fotos y escaneo.' },
      { titulo: 'Colocación', texto: 'Una cita de unos 60 minutos, sin anestesia.' },
      { titulo: 'Ajustes mensuales', texto: 'Cambio de ligas y arcos.' },
      { titulo: 'Retiro y retención', texto: 'Quitamos los brackets y colocamos retenedor.' },
    ],
    cuidados: [
      'Nada de cosas duras o pegajosas: elotes a mordidas, caramelo, hielo.',
      'Cepillo interdental para limpiar entre bracket y bracket.',
      'Cera de ortodoncia si algo te roza.',
    ],
    preguntas: [
      { pregunta: '¿Cuánto se paga al mes?', respuesta: 'Se divide en un enganche y mensualidades por cada revisión. En /precios puedes simularlo.' },
      { pregunta: '¿Y si se despega uno?', respuesta: 'Avísanos por WhatsApp. Si no lastima, se recoloca en tu siguiente cita.' },
    ],
  },
  {
    slug: 'implantes',
    codigo: 'T-06',
    nombre: 'Implantes',
    linea: 'Una raíz de titanio y una corona encima, para la pieza que falta.',
    categoria: 'Cirugía e implantes',
    desde: 16500,
    unidad: 'por pieza',
    porPieza: true,
    aplicaA: ['incisivo', 'canino', 'premolar', 'molar'],
    citas: { base: 1, porPieza: 2 },
    minutosCita: 60,
    duracion: 'De 3 a 6 meses entre colocación y corona',
    enQueConsiste:
      'Colocamos un implante de titanio en el hueso, donde estaba la raíz. Esperamos a que el hueso lo integre y después ponemos la corona. Se planea con radiografía y escaneo para saber exactamente dónde va.',
    paraQuien: [
      'Si te falta una pieza (o varias) y hay hueso suficiente.',
      'Alternativa a un puente que obligaría a desgastar los dientes vecinos.',
      'Requiere encías sanas y, si fumas, platicarlo antes.',
    ],
    etapas: [
      { titulo: 'Planeación', texto: 'Radiografía 3D y escaneo.' },
      { titulo: 'Colocación', texto: 'Con anestesia local; unos 60 minutos por implante.' },
      { titulo: 'Integración', texto: 'De 3 a 6 meses. Puedes llevar un provisional.' },
      { titulo: 'Corona', texto: 'Se toma la medida y se coloca la corona definitiva.' },
    ],
    cuidados: [
      'Dieta blanda y fría las primeras 48 horas.',
      'Sin enjuagues fuertes el primer día.',
      'Revisión anual con radiografía.',
    ],
    preguntas: [
      { pregunta: '¿Duele la colocación?', respuesta: 'Con anestesia local no. Los días siguientes hay molestia que se controla con analgésico.' },
      { pregunta: '¿El precio incluye la corona?', respuesta: 'El "desde" es implante más corona sencilla. Si hace falta injerto de hueso, se cotiza aparte.' },
    ],
  },
  {
    slug: 'carillas',
    codigo: 'T-07',
    nombre: 'Carillas',
    linea: 'Una capa delgada que cambia forma y color de los dientes de enfrente.',
    categoria: 'Estética',
    desde: 5800,
    unidad: 'por pieza',
    porPieza: true,
    aplicaA: ['incisivo', 'canino', 'premolar'],
    citas: { base: 2, porPieza: 0 },
    minutosCita: 60,
    duracion: 'Dos o tres citas',
    enQueConsiste:
      'Una lámina delgada de resina o de cerámica que se pega en la cara de enfrente del diente. Sirve para corregir manchas que no se van con blanqueamiento, dientes despostillados o pequeñas diferencias de forma.',
    paraQuien: [
      'Dientes de enfrente con manchas, desgaste o formas que te incomodan.',
      'No es para tapar dientes con caries ni encías enfermas.',
      'Si rechinas los dientes, primero una guarda.',
    ],
    etapas: [
      { titulo: 'Diseño de sonrisa', texto: 'Probamos la forma en boca antes de hacer nada.' },
      { titulo: 'Preparación', texto: 'Desgaste mínimo o ninguno, según el material.' },
      { titulo: 'Cementado', texto: 'Se pegan y se ajusta la mordida.' },
    ],
    cuidados: [
      'No muerdas uñas, plumas ni hielo.',
      'Guarda nocturna si aprietas los dientes.',
      'Limpieza cada 6 meses.',
    ],
    preguntas: [
      { pregunta: '¿Se ven falsas?', respuesta: 'Si se diseñan con tu cara y tu tono, no. Por eso probamos antes.' },
      { pregunta: '¿Cuántas necesito?', respuesta: 'Las que se ven al sonreír y nada más. Muchas veces son 4 o 6, no 20.' },
    ],
  },
  {
    slug: 'endodoncia',
    codigo: 'T-08',
    nombre: 'Endodoncia',
    linea: 'El "tratamiento de conductos": salvar la pieza en lugar de sacarla.',
    categoria: 'Restauración',
    desde: 3400,
    unidad: 'por pieza',
    porPieza: true,
    aplicaA: ['incisivo', 'canino', 'premolar', 'molar'],
    citas: { base: 0, porPieza: 2 },
    minutosCita: 90,
    duracion: 'Una o dos citas de 60 a 90 minutos',
    enQueConsiste:
      'Cuando la caries llega al nervio, limpiamos los conductos de la raíz, los desinfectamos y los sellamos. Así conservas tu diente. Después casi siempre hace falta una corona para protegerlo.',
    paraQuien: [
      'Dolor que te despierta en la noche o que dura mucho después del frío.',
      'Dientes con infección o golpe fuerte.',
      'Cuando la radiografía muestra que la caries ya llegó al nervio.',
    ],
    etapas: [
      { titulo: 'Radiografía', texto: 'Para ver cuántos conductos hay y qué tan largos son.' },
      { titulo: 'Anestesia y aislamiento', texto: 'Una hoja de hule protege la pieza.' },
      { titulo: 'Limpieza de conductos', texto: 'Con limas muy finas y desinfectante.' },
      { titulo: 'Sellado', texto: 'Rellenamos los conductos y cerramos.' },
    ],
    cuidados: [
      'No mastiques de ese lado hasta poner la corona.',
      'Molestia al morder 2 o 3 días: normal.',
      'Si se inflama, llámanos.',
    ],
    preguntas: [
      { pregunta: '¿Es tan horrible como dicen?', respuesta: 'Con buena anestesia, se siente como una resina larga. Lo que duele es el diente antes del tratamiento.' },
      { pregunta: '¿No es mejor sacarlo?', respuesta: 'Casi siempre conviene conservar tu diente. Si no se puede, te lo decimos y vemos opciones.' },
    ],
  },
  {
    slug: 'odontopediatria',
    codigo: 'T-09',
    nombre: 'Odontopediatría',
    linea: 'Consulta para peques: primero se conocen, luego se revisa.',
    categoria: 'Niñas y niños',
    desde: 550,
    unidad: 'por consulta',
    porPieza: false,
    citas: { base: 1, porPieza: 0 },
    minutosCita: 30,
    duracion: '30 minutos',
    enQueConsiste:
      'Revisión, limpieza y aplicación de flúor o selladores para niñas y niños. La primera cita es para que conozcan el consultorio, el sillón y los instrumentos sin hacer nada que no quieran.',
    paraQuien: [
      'Desde que sale el primer diente (sí, tan pronto).',
      'Revisión cada 6 meses.',
      'Peques con miedo: vamos a su ritmo.',
    ],
    etapas: [
      { titulo: 'Conocer el lugar', texto: 'Subirse al sillón, tocar el espejo, ver la luz.' },
      { titulo: 'Revisión', texto: 'Con mamá, papá o quien les acompañe al lado.' },
      { titulo: 'Prevención', texto: 'Limpieza, flúor y, si conviene, selladores.' },
    ],
    cuidados: [
      'Cepillado supervisado hasta los 8 años más o menos.',
      'Pasta con flúor del tamaño de un chícharo (o un granito de arroz en bebés).',
      'Agua en lugar de jugos entre comidas.',
    ],
    preguntas: [
      { pregunta: '¿Y si llora?', respuesta: 'Pasa. Paramos, platicamos y si hace falta lo dejamos para otro día. Una mala experiencia cuesta años.' },
      { pregunta: '¿Los dientes de leche se curan?', respuesta: 'Sí. Guardan el espacio para los permanentes y una caries ahí también duele.' },
    ],
  },
]

export const tratamientoPorSlug = (slug: string) => tratamientos.find(t => t.slug === slug)
