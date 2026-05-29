export interface Ticket {
  id: string
  filtra: string
  refMoviment: string
  titular: string
  concepte: string
  categoria: string
  tipus: string
  dataEmissio: string
  dataVenciment: string
  formaPagament: string
  import: number
  pendent: number
  estat: string
  entregada: boolean
}

export interface Stats {
  total: number
  entregades: number
  pendents: number
}
