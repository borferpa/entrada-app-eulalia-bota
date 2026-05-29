"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react"
import type { Ticket } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TicketsTableProps {
  tickets: Ticket[]
  onDeliveryToggle: (ticketId: string, newValue: boolean) => void
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ca-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

// Mobile Card View Component
function TicketCard({ ticket, onDeliveryToggle }: { ticket: Ticket; onDeliveryToggle: (id: string, value: boolean) => void }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className={cn(
      "transition-all duration-200",
      ticket.entregada && "bg-[oklch(0.55_0.15_145)]/5 border-[oklch(0.55_0.15_145)]/20"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-foreground truncate">{ticket.titular}</p>
              <Badge
                variant={ticket.entregada ? "default" : "secondary"}
                className={cn(
                  "shrink-0",
                  ticket.entregada
                    ? "bg-[oklch(0.55_0.15_145)] hover:bg-[oklch(0.55_0.15_145)]/90 text-white"
                    : "bg-[oklch(0.75_0.15_75)] text-[oklch(0.25_0.05_75)]"
                )}
              >
                {ticket.entregada ? "Entregada" : "Pendent"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{ticket.concepte}</p>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-medium text-foreground">{formatCurrency(ticket.import)}</span>
              <Badge variant="outline" className="text-xs">
                {ticket.tipus}
              </Badge>
              <Badge
                variant={ticket.estat === "Pagat" ? "default" : "destructive"}
                className={cn(
                  "text-xs",
                  ticket.estat === "Pagat" 
                    ? "bg-[oklch(0.55_0.15_145)]/10 text-[oklch(0.45_0.15_145)] border-[oklch(0.55_0.15_145)]/30" 
                    : ""
                )}
              >
                {ticket.estat}
              </Badge>
            </div>
          </div>
          <Button
            variant={ticket.entregada ? "default" : "outline"}
            size="icon"
            onClick={() => onDeliveryToggle(ticket.id, !ticket.entregada)}
            className={cn(
              "h-12 w-12 shrink-0",
              ticket.entregada
                ? "bg-[oklch(0.55_0.15_145)] hover:bg-[oklch(0.55_0.15_145)]/90 text-white"
                : "border-2 border-dashed"
            )}
          >
            {ticket.entregada ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
            <span className="sr-only">
              {ticket.entregada ? "Marcar com no entregada" : "Marcar com entregada"}
            </span>
          </Button>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-muted-foreground mt-3 hover:text-foreground transition-colors"
        >
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {isExpanded ? "Menys detalls" : "Més detalls"}
        </button>
        
        {isExpanded && (
          <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Ref:</span>
              <span className="ml-1 font-mono">{ticket.refMoviment}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Filtra:</span>
              <span className="ml-1">{ticket.filtra}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Emissió:</span>
              <span className="ml-1">{formatDate(ticket.dataEmissio)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Venciment:</span>
              <span className="ml-1">{formatDate(ticket.dataVenciment)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pagament:</span>
              <span className="ml-1">{ticket.formaPagament}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Pendent:</span>
              <span className="ml-1">{formatCurrency(ticket.pendent)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function TicketsTable({ tickets, onDeliveryToggle }: TicketsTableProps) {
  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Circle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium text-foreground">No s&apos;han trobat entrades</p>
          <p className="text-sm text-muted-foreground">Prova amb una altra cerca</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Mobile View */}
      <div className="flex flex-col gap-3 lg:hidden">
        {tickets.map((ticket) => (
          <TicketCard 
            key={ticket.id} 
            ticket={ticket} 
            onDeliveryToggle={onDeliveryToggle}
          />
        ))}
      </div>

      {/* Desktop View */}
      <Card className="hidden lg:block overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[80px]">Filtra</TableHead>
                <TableHead className="w-[130px]">Ref. Moviment</TableHead>
                <TableHead className="min-w-[180px]">Titular</TableHead>
                <TableHead className="min-w-[200px]">Concepte</TableHead>
                <TableHead className="w-[100px]">Tipus</TableHead>
                <TableHead className="w-[110px]">Data Emissió</TableHead>
                <TableHead className="w-[110px]">Venciment</TableHead>
                <TableHead className="w-[120px]">Pagament</TableHead>
                <TableHead className="w-[100px] text-right">Import</TableHead>
                <TableHead className="w-[100px] text-right">Pendent</TableHead>
                <TableHead className="w-[90px]">Estat</TableHead>
                <TableHead className="w-[140px] text-center">Entrega</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className={cn(
                    "transition-colors",
                    ticket.entregada && "bg-[oklch(0.55_0.15_145)]/5 hover:bg-[oklch(0.55_0.15_145)]/10"
                  )}
                >
                  <TableCell className="font-mono text-xs">{ticket.filtra}</TableCell>
                  <TableCell className="font-mono text-xs">{ticket.refMoviment}</TableCell>
                  <TableCell className="font-medium">{ticket.titular}</TableCell>
                  <TableCell className="text-sm">{ticket.concepte}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {ticket.tipus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(ticket.dataEmissio)}</TableCell>
                  <TableCell className="text-sm">{formatDate(ticket.dataVenciment)}</TableCell>
                  <TableCell className="text-sm">{ticket.formaPagament}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(ticket.import)}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-medium",
                    ticket.pendent > 0 && "text-destructive"
                  )}>
                    {formatCurrency(ticket.pendent)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={ticket.estat === "Pagat" ? "default" : "destructive"}
                      className={cn(
                        "text-xs",
                        ticket.estat === "Pagat" 
                          ? "bg-[oklch(0.55_0.15_145)]/10 text-[oklch(0.45_0.15_145)] border-[oklch(0.55_0.15_145)]/30" 
                          : ""
                      )}
                    >
                      {ticket.estat}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant={ticket.entregada ? "default" : "outline"}
                      size="sm"
                      onClick={() => onDeliveryToggle(ticket.id, !ticket.entregada)}
                      className={cn(
                        "gap-2 min-w-[110px]",
                        ticket.entregada
                          ? "bg-[oklch(0.55_0.15_145)] hover:bg-[oklch(0.55_0.15_145)]/90 text-white"
                          : "border-2 border-dashed hover:border-solid hover:bg-[oklch(0.55_0.15_145)]/10 hover:border-[oklch(0.55_0.15_145)]/30"
                      )}
                    >
                      {ticket.entregada ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Entregada
                        </>
                      ) : (
                        <>
                          <Circle className="h-4 w-4" />
                          Pendent
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  )
}
