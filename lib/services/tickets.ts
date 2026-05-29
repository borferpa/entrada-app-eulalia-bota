import type { Ticket } from '@/lib/types'
import entradesData from '@/data/entradas.json'
import bebidesData from '@/data/bebida-refresco.json'
import aiguaData from '@/data/bebida-agua.json'
import gelatData from '@/data/helados.json'

// "3,50 €" → 3.5
function parseEuros(value: string): number {
  return parseFloat((value as string).replace(/[€\s]/g, '').replace(',', '.')) || 0
}

// "25-05-2026" → "2026-05-25"
function parseDate(value: string): string {
  const [day, month, year] = (value as string).split('-')
  return `${year}-${month}-${day}`
}

function parseConcepte(value: string): string {
  return value.replace(/^.*TIQUET\s+/i, '').trim()
}

function mapRows(rows: string[][], prefix: string): Ticket[] {
  return rows.map((row, index) => ({
    id: `${prefix}-${index + 1}`,
    refMoviment: row[0],
    titular: row[1],
    concepte: parseConcepte(row[2]),
    tipus: row[3],
    dataEmissio: parseDate(row[4]),
    dataVenciment: parseDate(row[5]),
    formaPagament: row[6],
    import: parseEuros(row[7]),
    pendent: parseEuros(row[8]),
    estat: row[9],
    filtra: parseDate(row[4]).substring(0, 4),
    entregada: false,
  }))
}

export async function getTickets(): Promise<Ticket[]> {
  return [
    ...mapRows(entradesData as string[][], 'e'),
    ...mapRows(bebidesData as string[][], 'b'),
    ...mapRows(aiguaData as string[][], 'a'),
    ...mapRows(gelatData as string[][], 'g'),
  ]
}

export async function updateEntregada(id: string, entregada: boolean): Promise<void> {
  void id
  void entregada
}
