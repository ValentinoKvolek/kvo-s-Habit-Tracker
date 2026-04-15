"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { otherWorkoutSchema, type OtherWorkoutData } from "@/features/workouts/schema";
import { saveWorkoutLog } from "@/features/workouts/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { SessionPicker } from "./session-picker";
import type { WorkoutLogEntry } from "@/features/workouts/queries";

interface OtherFormProps {
  habitId: string;
  date: string;
  initialData: OtherWorkoutData | null;
  history: WorkoutLogEntry[];
}

export function OtherForm({ habitId, date, initialData, history }: OtherFormProps) {
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<OtherWorkoutData>({
    resolver: zodResolver(otherWorkoutSchema),
    defaultValues: initialData ?? { notes: "" },
  });

  async function onSubmit(data: OtherWorkoutData) {
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
      <SessionPicker<OtherWorkoutData>
        history={history}
        onLoad={(data) => {
          reset(data);
          toast.info("Sesión cargada. Editala y guardá para registrarla hoy.");
        }}
      />

      <input
        {...register("sessionName")}
        placeholder="Nombre de la sesión (opcional)"
        className={cn(
          "h-10 w-full rounded-xl px-3.5 text-sm",
          "bg-parchment-100 border border-parchment-300",
          "text-parchment-950 placeholder:text-parchment-400",
          "focus:outline-none focus:border-sienna-600",
          "transition-colors"
        )}
      />

      <textarea
        {...register("notes")}
        placeholder="¿Cómo fue la sesión? Anotá lo que quieras..."
        className={cn(
          "w-full h-24 rounded-xl px-3.5 py-2.5 text-sm resize-none",
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
