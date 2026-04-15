"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Timer, Route } from "lucide-react";
import { toast } from "sonner";
import { cardioWorkoutSchema, type CardioWorkoutData } from "@/features/workouts/schema";
import { saveWorkoutLog } from "@/features/workouts/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { SessionPicker } from "./session-picker";
import type { WorkoutLogEntry } from "@/features/workouts/queries";

interface CardioFormProps {
  habitId: string;
  date: string;
  initialData: CardioWorkoutData | null;
  history: WorkoutLogEntry[];
}

export function CardioForm({ habitId, date, initialData, history }: CardioFormProps) {
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<CardioWorkoutData>({
    resolver: zodResolver(cardioWorkoutSchema),
    defaultValues: initialData ?? { distance: undefined, duration: undefined, notes: "" },
  });

  async function onSubmit(data: CardioWorkoutData) {
    setSaving(true);
    try {
      await saveWorkoutLog(habitId, date, data);
      toast.success("Sesión guardada.");
    } catch {
      toast.error("No se pudo guardar. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <SessionPicker<CardioWorkoutData>
        history={history}
        onLoad={(data) => {
          reset(data);
          toast.info("Sesión cargada. Editala y guardá para registrarla hoy.");
        }}
      />

      <input
        {...register("sessionName")}
        placeholder="Nombre de la sesión (ej: Rodada larga, Recuperación...)"
        className={cn(
          "h-10 w-full rounded-xl px-3.5 text-sm",
          "bg-parchment-100 border border-parchment-300",
          "text-parchment-950 placeholder:text-parchment-400",
          "focus:outline-none focus:border-sienna-600",
          "transition-colors"
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-parchment-500 flex items-center gap-1.5">
            <Route size={12} />
            Distancia (km)
          </label>
          <input
            {...register("distance")}
            type="number"
            min={0}
            step={0.1}
            placeholder="0.0"
            className={cn(
              "h-10 w-full rounded-xl px-3 text-sm",
              "bg-parchment-100 border border-parchment-300",
              "text-parchment-950 placeholder:text-parchment-400",
              "focus:outline-none focus:border-sienna-600",
              "transition-colors"
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-parchment-500 flex items-center gap-1.5">
            <Timer size={12} />
            Duración (min)
          </label>
          <input
            {...register("duration")}
            type="number"
            min={0}
            max={1440}
            placeholder="0"
            className={cn(
              "h-10 w-full rounded-xl px-3 text-sm",
              "bg-parchment-100 border border-parchment-300",
              "text-parchment-950 placeholder:text-parchment-400",
              "focus:outline-none focus:border-sienna-600",
              "transition-colors"
            )}
          />
        </div>
      </div>

      <textarea
        {...register("notes")}
        placeholder="Notas opcionales sobre la sesión..."
        className={cn(
          "w-full h-16 rounded-xl px-3.5 py-2.5 text-sm resize-none",
          "bg-parchment-100 border border-parchment-300",
          "text-parchment-950 placeholder:text-parchment-400",
          "focus:outline-none focus:border-sienna-600",
          "transition-colors"
        )}
      />

      <Button type="submit" variant="brand" size="sm" isLoading={saving} className="self-end gap-1.5">
        <Save size={14} />
        Guardar sesión
      </Button>
    </form>
  );
}
