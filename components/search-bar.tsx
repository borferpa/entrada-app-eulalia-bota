import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Cercar per nom, referència, concepte, tipus..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 pl-10 pr-10 text-base shadow-sm"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Esborrar cerca</span>
        </Button>
      )}
    </div>
  )
}
