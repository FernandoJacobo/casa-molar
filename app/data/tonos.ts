/**
 * Escala de tonos para el simulador, ordenada de más claro a más oscuro (orden de luminosidad
 * habitual de las guías de tonos tipo "A-D"). Los hex son aproximaciones para pantalla.
 */
export interface Tono {
  codigo: string
  hex: string
}

export const tonos: Tono[] = [
  { codigo: 'B1', hex: '#F2EBDD' },
  { codigo: 'A1', hex: '#EEE3CF' },
  { codigo: 'B2', hex: '#EBDDC2' },
  { codigo: 'D2', hex: '#E6D8C0' },
  { codigo: 'A2', hex: '#E5D2B3' },
  { codigo: 'C1', hex: '#DFD0B6' },
  { codigo: 'C2', hex: '#D8C6A6' },
  { codigo: 'D4', hex: '#D9C7AA' },
  { codigo: 'A3', hex: '#DCC39B' },
  { codigo: 'D3', hex: '#D8BE95' },
  { codigo: 'B3', hex: '#D9BC8D' },
  { codigo: 'A3.5', hex: '#D4B685' },
  { codigo: 'B4', hex: '#D1B07B' },
  { codigo: 'C3', hex: '#CDB08A' },
  { codigo: 'A4', hex: '#C7A574' },
  { codigo: 'C4', hex: '#BF9F6F' },
]

export const tonoPorCodigo = (codigo: string) => tonos.find(t => t.codigo === codigo)
