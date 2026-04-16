import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Mark — a single deliberate circle, no decoration for its own sake */}
      <div className="relative w-20 h-20 mb-8">
        <svg
          viewBox="0 0 80 80"
          fill="none"
          className="w-full h-full text-parchment-400"
          aria-hidden
        >
          <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="1" />
          <circle cx="40" cy="40" r="18" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" />
          <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.5" />
        </svg>
      </div>

      <h3 className="font-serif text-base font-normal text-parchment-950 mb-2 tracking-tight">
        Empezá tu primer hábito
      </h3>
      <p className="text-sm text-parchment-500 max-w-xs mb-8 leading-relaxed">
        Los mejores cambios comienzan pequeños. Agregá un hábito que quieras mantener y empezá a construir tu racha hoy.
      </p>

      <Link href="/habits/new">
        <Button variant="brand" size="md" className="gap-2">
          <Plus size={16} />
          Crear mi primer hábito
        </Button>
      </Link>
    </div>
  );
}
