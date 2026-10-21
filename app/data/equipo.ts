/** Profesionales FICTICIOS. Nombres, cédulas, años y especialidades son inventados. */

export type Peinado = 'chongo' | 'corto' | 'rizado' | 'lacio'

export interface Profesional {
  id: string
  nombre: string
  /** Nombre de trato: "Dra. Ifigenia". */
  trato: string
  rol: string
  especialidad: string
  cedula: string
  anios: number
  disfruta: string
  /** Una frase suya, en su voz. */
  frase: string
  /** Código de tono para su pestaña-muestra. */
  tono: string
  /** Tratamientos que atiende (slugs). */
  tratamientos: string[]
  /** Días que da consulta (0 = domingo). */
  dias: number[]
  avatar: { peinado: Peinado; lentes: boolean; barba: boolean; aretes: boolean }
}

export const equipo: Profesional[] = [
  {
    id: 'ifigenia',
    nombre: 'Dra. Ifigenia Larrondo',
    trato: 'Dra. Ifigenia',
    rol: 'Odontología general · dirección clínica',
    especialidad: 'Odontología general (ejemplo)',
    cedula: 'Cédula DEMO-0000001',
    anios: 16,
    disfruta: 'Cuando alguien que llevaba diez años sin venir al dentista sale diciendo "no era para tanto".',
    frase: 'Primero te explico lo que veo. Luego decides tú.',
    tono: 'A1',
    tratamientos: ['limpieza', 'resinas', 'blanqueamiento', 'carillas'],
    dias: [1, 2, 3, 4, 5],
    avatar: { peinado: 'chongo', lentes: true, barba: false, aretes: true },
  },
  {
    id: 'eleuterio',
    nombre: 'Dr. Eleuterio Zubizarreta',
    trato: 'Dr. Eleuterio',
    rol: 'Ortodoncia',
    especialidad: 'Especialidad en ortodoncia (ejemplo)',
    cedula: 'Cédula DEMO-0000002',
    anios: 11,
    disfruta: 'El día que quitamos los brackets y la persona se ve en el espejo por primera vez.',
    frase: 'Los dientes se mueven despacio. La paciencia también se entrena.',
    tono: 'B2',
    tratamientos: ['alineadores', 'brackets'],
    dias: [2, 4, 6],
    avatar: { peinado: 'corto', lentes: false, barba: true, aretes: false },
  },
  {
    id: 'maite',
    nombre: 'Dra. Maite Oyarzábal',
    trato: 'Dra. Maite',
    rol: 'Endodoncia e implantes',
    especialidad: 'Especialidad en endodoncia (ejemplo)',
    cedula: 'Cédula DEMO-0000003',
    anios: 9,
    disfruta: 'Salvar una pieza que ya daban por perdida.',
    frase: 'Si se puede conservar tu diente, lo intentamos primero.',
    tono: 'A2',
    tratamientos: ['endodoncia', 'implantes', 'resinas'],
    dias: [1, 3, 5, 6],
    avatar: { peinado: 'rizado', lentes: false, barba: false, aretes: true },
  },
  {
    id: 'celestina',
    nombre: 'Dra. Celestina Urquidi',
    trato: 'Dra. Celestina',
    rol: 'Odontopediatría',
    especialidad: 'Especialidad en odontopediatría (ejemplo)',
    cedula: 'Cédula DEMO-0000004',
    anios: 7,
    disfruta: 'Que un peque llegue llorando y a la tercera cita pida subirse solo al sillón.',
    frase: 'Aquí nadie hace nada sin que te lo enseñemos antes.',
    tono: 'C1',
    tratamientos: ['odontopediatria', 'limpieza'],
    dias: [1, 2, 4, 5, 6],
    avatar: { peinado: 'lacio', lentes: true, barba: false, aretes: false },
  },
]

export const profesionalPorId = (id: string) => equipo.find(p => p.id === id)
