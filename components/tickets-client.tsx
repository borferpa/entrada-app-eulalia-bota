'use client'

import { useState, useMemo, useEffect } from 'react'
import { SearchBar } from '@/components/search-bar'
import { TicketsTable } from '@/components/tickets-table'
import { StatsCards } from '@/components/stats-cards'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Ticket } from '@/lib/types'

const PAGE_SIZES = [25, 50, 100]

export type SortKey = 'entregada' | 'filtra' | 'refMoviment' | 'titular' | 'concepte' | 'dataEmissio' | 'dataVenciment' | 'import' | 'pendent' | 'estat'
export type SortDir = 'asc' | 'desc'

const CATEGORIES = [
  { key: 'entrada',  label: 'Entrades',  emoji: '🎟️', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { key: 'refresc',  label: 'Refrescos', emoji: '🥤', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { key: 'aigua',    label: 'Aigues',    emoji: '💧', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { key: 'gelat',    label: 'Gelats',    emoji: '🍦', color: 'bg-pink-50 text-pink-700 border-pink-200' },
]

interface TicketsClientProps {
  initialTickets: Ticket[]
}

export function TicketsClient({ initialTickets }: TicketsClientProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const [searchQuery, setSearchQuery] = useState('')
  const [estatFilter, setEstatFilter] = useState<'tots' | 'Pagat' | 'Pendent'>('tots')
  const [entregadaFilter, setEntregadaFilter] = useState<'tots' | 'entregat' | 'pendent'>('tots')
  const [sortKey, setSortKey] = useState<SortKey>('titular')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const filteredTickets = useMemo(() => {
    let result = tickets
    if (estatFilter !== 'tots') result = result.filter((t) => t.estat === estatFilter)
    if (entregadaFilter === 'entregat') result = result.filter((t) => t.entregada)
    if (entregadaFilter === 'pendent')  result = result.filter((t) => !t.entregada)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((t) =>
        t.refMoviment.toLowerCase().includes(query) ||
        t.titular.toLowerCase().includes(query) ||
        t.concepte.toLowerCase().includes(query) ||
        t.tipus.toLowerCase().includes(query) ||
        t.formaPagament.toLowerCase().includes(query) ||
        t.estat.toLowerCase().includes(query) ||
        t.import.toString().includes(query)
      )
    }
    return [...result].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      let cmp = 0
      if (typeof av === 'boolean' && typeof bv === 'boolean') cmp = Number(av) - Number(bv)
      else if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv
      else cmp = String(av).localeCompare(String(bv), 'ca')
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [tickets, searchQuery, estatFilter, entregadaFilter, sortKey, sortDir])

  useEffect(() => { setCurrentPage(1) }, [searchQuery, pageSize, estatFilter, entregadaFilter, sortKey, sortDir])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

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
      count: tickets.filter((t) => t.categoria === cat.key).length,
    })),
    [tickets]
  )

  const handleDeliveryToggle = async (ticketId: string, newValue: boolean) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, entregada: newValue } : t))
    )
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entregada: newValue }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    } catch {
      // Revertir update optimista si falla
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, entregada: !newValue } : t))
      )
    }
  }

  return (
    <>
      <StatsCards stats={stats} />
      <div className="flex flex-wrap gap-2">
        {categoryCounts.map((cat) => (
          <div
            key={cat.key}
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium ${cat.color}`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
            <span className="font-bold">{cat.count}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Pagament:</span>
        {(['tots', 'Pagat', 'Pendent'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setEstatFilter(opt)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              estatFilter === opt
                ? opt === 'Pagat'
                  ? 'bg-[oklch(0.55_0.15_145)] text-white border-[oklch(0.55_0.15_145)]'
                  : opt === 'Pendent'
                  ? 'bg-destructive text-white border-destructive'
                  : 'bg-foreground text-background border-foreground'
                : 'bg-background text-muted-foreground border-border hover:border-foreground'
            }`}
          >
            {opt === 'tots' ? 'Tots' : opt}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Entrega:</span>
        {(['tots', 'entregat', 'pendent'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setEntregadaFilter(opt)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              entregadaFilter === opt
                ? opt === 'entregat'
                  ? 'bg-[oklch(0.55_0.15_145)] text-white border-[oklch(0.55_0.15_145)]'
                  : opt === 'pendent'
                  ? 'bg-[oklch(0.75_0.15_75)] text-[oklch(0.25_0.05_75)] border-[oklch(0.75_0.15_75)]'
                  : 'bg-foreground text-background border-foreground'
                : 'bg-background text-muted-foreground border-border hover:border-foreground'
            }`}
          >
            {opt === 'tots' ? 'Tots' : opt === 'entregat' ? 'Entregat' : 'Pendent'}
          </button>
        ))}
      </div>
      </div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      {searchQuery.trim() && (
        <p className="text-sm text-muted-foreground">
          {filteredTickets.length} {filteredTickets.length === 1 ? 'resultat' : 'resultats'} per a &ldquo;{searchQuery}&rdquo;
        </p>
      )}
      <TicketsTable tickets={pagedTickets} onDeliveryToggle={handleDeliveryToggle} sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
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
