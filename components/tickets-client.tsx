'use client'

import { useState, useMemo, useEffect } from 'react'
import { SearchBar } from '@/components/search-bar'
import { TicketsTable } from '@/components/tickets-table'
import { StatsCards } from '@/components/stats-cards'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Ticket } from '@/lib/types'

const PAGE_SIZES = [25, 50, 100]

const CATEGORIES = [
  { prefix: 'e', label: 'Entrades',  emoji: '🎟️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { prefix: 'b', label: 'Refrescos', emoji: '🥤', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { prefix: 'a', label: 'Aigues',    emoji: '💧', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { prefix: 'g', label: 'Gelats',    emoji: '🍦', color: 'bg-pink-50 text-pink-700 border-pink-200' },
]

interface TicketsClientProps {
  initialTickets: Ticket[]
}

export function TicketsClient({ initialTickets }: TicketsClientProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) return tickets
    const query = searchQuery.toLowerCase()
    return tickets.filter((t) =>
      t.refMoviment.toLowerCase().includes(query) ||
      t.titular.toLowerCase().includes(query) ||
      t.concepte.toLowerCase().includes(query) ||
      t.tipus.toLowerCase().includes(query) ||
      t.formaPagament.toLowerCase().includes(query) ||
      t.estat.toLowerCase().includes(query) ||
      t.import.toString().includes(query)
    )
  }, [tickets, searchQuery])

  useEffect(() => { setCurrentPage(1) }, [searchQuery, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize))
  const pagedTickets = filteredTickets.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const stats = useMemo(() => {
    const total = tickets.length
    const entregades = tickets.filter((t) => t.entregada).length
    return { total, entregades, pendents: total - entregades }
  }, [tickets])

  const categoryCounts = useMemo(() =>
    CATEGORIES.map((cat) => ({
      ...cat,
      count: tickets.filter((t) => t.id.startsWith(`${cat.prefix}-`)).length,
    })),
    [tickets]
  )

  const handleDeliveryToggle = async (ticketId: string, newValue: boolean) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, entregada: newValue } : t))
    )
    await fetch(`/api/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entregada: newValue }),
    })
  }

  return (
    <>
      <StatsCards stats={stats} />
      <div className="flex flex-wrap gap-2">
        {categoryCounts.map((cat) => (
          <div
            key={cat.prefix}
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${cat.color}`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
            <span className="font-bold">{cat.count}</span>
          </div>
        ))}
      </div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      {searchQuery.trim() && (
        <p className="text-sm text-muted-foreground">
          {filteredTickets.length} {filteredTickets.length === 1 ? 'resultat' : 'resultats'} per a &ldquo;{searchQuery}&rdquo;
        </p>
      )}
      <TicketsTable tickets={pagedTickets} onDeliveryToggle={handleDeliveryToggle} />
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Files per pàgina:</span>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((s) => (
                <SelectItem key={s} value={String(s)}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>
            {filteredTickets.length === 0
              ? '0 resultats'
              : `${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filteredTickets.length)} de ${filteredTickets.length}`}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 1}>‹</Button>
          <span className="px-3 text-sm">
            {currentPage} / {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === totalPages}>›</Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</Button>
        </div>
      </div>
    </>
  )
}
