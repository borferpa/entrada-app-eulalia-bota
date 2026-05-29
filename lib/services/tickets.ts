import type { Ticket } from '@/lib/types'
import { supabase } from '@/lib/supabase'

type DbTicket = {
  id: string
  ref_moviment: string
  titular: string
  concepte: string
  categoria: string
  tipus: string
  data_emissio: string
  data_venciment: string
  forma_pagament: string
  import: number
  pendent: number
  estat: string
  entregada: boolean
  filtra: string
}

function toTicket(row: DbTicket): Ticket {
  return {
    id:            row.id,
    refMoviment:   row.ref_moviment,
    titular:       row.titular,
    concepte:      row.concepte,
    categoria:     row.categoria,
    tipus:         row.tipus,
    dataEmissio:   row.data_emissio,
    dataVenciment: row.data_venciment,
    formaPagament: row.forma_pagament,
    import:        row.import,
    pendent:       row.pendent,
    estat:         row.estat,
    entregada:     row.entregada,
    filtra:        row.filtra,
  }
}

export async function getTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('data_emissio', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as DbTicket[]).map(toTicket)
}

export async function updateEntregada(id: string, entregada: boolean): Promise<void> {
  const { error } = await supabase
    .from('tickets')
    .update({ entregada })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
