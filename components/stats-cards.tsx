import { Card, CardContent } from "@/components/ui/card"
import { Ticket, CheckCircle2, Clock } from "lucide-react"
import type { Stats } from "@/lib/types"

interface StatsCardsProps {
  stats: Stats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const percentageDelivered = stats.total > 0 
    ? Math.round((stats.entregades / stats.total) * 100) 
    : 0

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Ticket className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                Total Entrades
              </p>
              <p className="text-2xl font-bold text-foreground sm:text-3xl">
                {stats.total}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[oklch(0.55_0.15_145)]/20 bg-gradient-to-br from-[oklch(0.55_0.15_145)]/5 to-[oklch(0.55_0.15_145)]/10">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.55_0.15_145)]/10">
              <CheckCircle2 className="h-6 w-6 text-[oklch(0.55_0.15_145)]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                Entregades
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground sm:text-3xl">
                  {stats.entregades}
                </p>
                <span className="text-sm font-medium text-[oklch(0.55_0.15_145)]">
                  {percentageDelivered}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[oklch(0.75_0.15_75)]/30 bg-gradient-to-br from-[oklch(0.75_0.15_75)]/5 to-[oklch(0.75_0.15_75)]/10">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.75_0.15_75)]/20">
              <Clock className="h-6 w-6 text-[oklch(0.65_0.15_75)]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                Pendents
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground sm:text-3xl">
                  {stats.pendents}
                </p>
                {stats.pendents > 0 && (
                  <span className="text-sm font-medium text-[oklch(0.65_0.15_75)]">
                    {100 - percentageDelivered}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
