/** Citas guardadas en este navegador (demo: no hay servidor). */
export interface Cita {
  folio: string
  motivo: string
  motivoTexto: string
  profesionalId: string
  /** "YYYY-MM-DD" */
  fecha: string
  /** "HH:mm" */
  hora: string
  duracion: number
  nombre: string
  telefono: string
  correo: string
  notas: string
  pieza: number | null
  creada: string
}

export function useCitas() {
  const citas = useLocalStorage<Cita[]>('casa-molar:citas', [], { initOnMounted: true })

  const guardar = (c: Cita) => {
    citas.value = [...citas.value.filter(x => x.folio !== c.folio), c].sort((a, b) => `${a.fecha}${a.hora}`.localeCompare(`${b.fecha}${b.hora}`))
  }
  const cancelar = (folio: string) => {
    citas.value = citas.value.filter(c => c.folio !== folio)
  }

  return { citas, guardar, cancelar }
}
