import { NextRequest, NextResponse } from 'next/server'
import { updateEntregada } from '@/lib/services/tickets'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { entregada } = await req.json() as { entregada: boolean }
  await updateEntregada(id, entregada)
  return NextResponse.json({ ok: true })
}
