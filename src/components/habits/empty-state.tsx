import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Animated rings illustration */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-[ping_3s_ease-in-out_infinite]" />
        <div className="absolute inset-2 rounded-full border-2 border-violet-500/30 animate-[ping_3s_ease-in-out_infinite_0.5s]" />
        <div className="absolute inset-4 rounded-full bg-violet-600/20 border border-violet-500/40 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-violet-400">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        Empezá tu primer hábito
      </h3>
      <p className="text-sm text-white/40 max-w-xs mb-6 leading-relaxed">
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
