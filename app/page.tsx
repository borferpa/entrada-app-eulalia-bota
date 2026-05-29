export const dynamic = 'force-dynamic'

import { Header } from '@/components/header'
import { TicketsClient } from '@/components/tickets-client'
import { getTickets } from '@/lib/services/tickets'
import { AlertCircle, Inbox } from 'lucide-react'

export default async function HomePage() {
  let tickets
  let errorMessage: string | null = null

  try {
    tickets = await getTickets()
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : 'Error desconegut'
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 space-y-6">
        {errorMessage ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">Error en carregar les dades</p>
              <p className="text-sm text-muted-foreground mt-1 font-mono">{errorMessage}</p>
            </div>
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="rounded-full bg-muted p-4">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">No hi ha tickets</p>
              <p className="text-sm text-muted-foreground mt-1">La base de dades no conté cap registre.</p>
            </div>
          </div>
        ) : (
          <TicketsClient initialTickets={tickets} />
        )}
      </div>
    </main>
  )
}
