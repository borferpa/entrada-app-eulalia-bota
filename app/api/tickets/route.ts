import { NextResponse } from 'next/server'
import { getTickets } from '@/lib/services/tickets'

export async function GET() {
  const tickets = await getTickets()
  return NextResponse.json(tickets)
}
