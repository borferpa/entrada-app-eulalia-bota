import { Header } from '@/components/header'
import { TicketsClient } from '@/components/tickets-client'
import { getTickets } from '@/lib/services/tickets'

export default async function HomePage() {
  const tickets = await getTickets()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 space-y-6">
        <TicketsClient initialTickets={tickets} />
      </div>
    </main>
  )
}
