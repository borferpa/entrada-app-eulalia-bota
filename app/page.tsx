"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { TicketsTable } from "@/components/tickets-table"
import { StatsCards } from "@/components/stats-cards"
import type { Ticket } from "@/lib/types"
import { mockTickets } from "@/lib/mock-data"

/**
 * ============================================================
 * INTEGRACIÓ AMB SUPABASE
 * ============================================================
 * 
 * Per connectar amb Supabase, substitueix el mock data pel següent codi:
 * 
 * import { createClient } from '@supabase/supabase-js'
 * 
 * const supabase = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 * )
 * 
 * useEffect(() => {
 *   async function fetchTickets() {
 *     const { data, error } = await supabase
 *       .from('entrades')
 *       .select('*')
 *       .order('data_emissio', { ascending: false })
 *     
 *     if (error) {
 *       console.error('Error fetching tickets:', error)
 *       return
 *     }
 *     
 *     setTickets(data || [])
 *   }
 *   
 *   fetchTickets()
 * }, [])
 * 
 * ============================================================
 */

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrar tickets segons la cerca
  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets

    const query = searchQuery.toLowerCase()
    return tickets.filter((ticket) => {
      return (
        ticket.refMoviment.toLowerCase().includes(query) ||
        ticket.titular.toLowerCase().includes(query) ||
        ticket.concepte.toLowerCase().includes(query) ||
        ticket.tipus.toLowerCase().includes(query) ||
        ticket.formaPagament.toLowerCase().includes(query) ||
        ticket.estat.toLowerCase().includes(query) ||
        ticket.import.toString().includes(query)
      )
    })
  }, [tickets, searchQuery])

  // Calcular estadístiques
  const stats = useMemo(() => {
    const total = tickets.length
    const entregades = tickets.filter((t) => t.entregada).length
    const pendents = total - entregades
    return { total, entregades, pendents }
  }, [tickets])

  /**
   * ============================================================
   * FUNCIÓ PER ACTUALITZAR L'ESTAT D'ENTREGA A SUPABASE
   * ============================================================
   * 
   * async function handleDeliveryToggle(ticketId: string, newValue: boolean) {
   *   // Actualitzar localment primer (optimistic update)
   *   setTickets((prev) =>
   *     prev.map((t) =>
   *       t.id === ticketId ? { ...t, entregada: newValue } : t
   *     )
   *   )
   *   
   *   // Actualitzar a Supabase
   *   const { error } = await supabase
   *     .from('entrades')
   *     .update({ entregada: newValue, data_entrega: newValue ? new Date().toISOString() : null })
   *     .eq('id', ticketId)
   *   
   *   if (error) {
   *     console.error('Error updating ticket:', error)
   *     // Revertir el canvi local si hi ha error
   *     setTickets((prev) =>
   *       prev.map((t) =>
   *         t.id === ticketId ? { ...t, entregada: !newValue } : t
   *       )
   *     )
   *   }
   * }
   * 
   * ============================================================
   */

  const handleDeliveryToggle = (ticketId: string, newValue: boolean) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, entregada: newValue } : t
      )
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <StatsCards stats={stats} />
        
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
        />
        
        <TicketsTable 
          tickets={filteredTickets} 
          onDeliveryToggle={handleDeliveryToggle}
        />
      </div>
    </main>
  )
}
