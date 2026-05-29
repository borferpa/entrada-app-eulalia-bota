import { GraduationCap } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight text-foreground sm:text-xl">
                Gestió d&apos;Entrades
              </h1>
              <p className="text-sm text-muted-foreground">
                Festa Final de Curs - Escola Eulàlia Bota
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">Curs 2023-2024</span>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              21 Juny 2024
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
