"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { gymWorkoutSchema, type GymWorkoutData } from "@/features/workouts/schema";
import { saveWorkoutLog } from "@/features/workouts/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { SessionPicker } from "./session-picker";
import type { WorkoutLogEntry } from "@/features/workouts/queries";

interface GymFormProps {
  habitId: string;
  date: string;
  initialData: GymWorkoutData | null;
  history: WorkoutLogEntry[];
}

export function GymForm({ habitId, date, initialData, history }: GymFormProps) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GymWorkoutData>({
    resolver: zodResolver(gymWorkoutSchema),
    defaultValues: initialData ?? {
      exercises: [{ name: "", sets: 3, reps: 10, weight: undefined }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  async function onSubmit(data: GymWorkoutData) {
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
      <SessionPicker<GymWorkoutData>
        history={history}
        onLoad={(data) => {
          reset(data);
          toast.info("Sesión cargada. Editala y guardá para registrarla hoy.");
        }}
      />

      <input
        {...register("sessionName")}
        placeholder="Nombre de la sesión (ej: Piernas, Empuje, Full body...)"
        className={cn(
          "h-10 w-full rounded-xl px-3.5 text-sm",
          "bg-parchment-100 border border-parchment-300",
          "text-parchment-950 placeholder:text-parchment-400",
          "focus:outline-none focus:border-sienna-600",
          "transition-colors"
        )}
      />

      <div className="hidden sm:grid sm:grid-cols-[1fr_64px_64px_72px_36px] gap-2 px-1">
        <span className="text-[10px] text-parchment-500 uppercase tracking-wider">Ejercicio</span>
        <span className="text-[10px] text-parchment-500 uppercase tracking-wider text-center">Series</span>
        <span className="text-[10px] text-parchment-500 uppercase tracking-wider text-center">Reps</span>
        <span className="text-[10px] text-parchment-500 uppercase tracking-wider text-center">Peso (kg)</span>
        <span />
      </div>

      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col sm:grid sm:grid-cols-[1fr_64px_64px_72px_36px] gap-2 bg-parchment-100 border border-parchment-300 rounded-xl p-3 sm:p-2"
          >
            <input
              {...register(`exercises.${index}.name`)}
              placeholder="Nombre del ejercicio"
              className={cn(
                "h-9 w-full rounded-lg px-3 text-sm",
                "bg-parchment-200 border border-parchment-300",
                "text-parchment-950 placeholder:text-parchment-400",
                "focus:outline-none focus:border-sienna-600",
                "transition-colors"
              )}
            />
            <div className="flex gap-2 sm:contents">
              <div className="flex flex-col flex-1 sm:flex-none">
                <span className="text-[10px] text-parchment-500 mb-1 sm:hidden">Series</span>
                <input
                  {...register(`exercises.${index}.sets`)}
                  type="number"
                  min={1}
                  max={99}
                  placeholder="3"
                  className={cn(
                    "h-9 w-full rounded-lg px-2 text-sm text-center",
                    "bg-parchment-200 border border-parchment-300",
                    "text-parchment-950 placeholder:text-parchment-400",
                    "focus:outline-none focus:border-sienna-600",
                    "transition-colors"
                  )}
                />
              </div>
              <div className="flex flex-col flex-1 sm:flex-none">
                <span className="text-[10px] text-parchment-500 mb-1 sm:hidden">Reps</span>
                <input
                  {...register(`exercises.${index}.reps`)}
                  type="number"
                  min={1}
                  max={999}
                  placeholder="10"
                  className={cn(
                    "h-9 w-full rounded-lg px-2 text-sm text-center",
                    "bg-parchment-200 border border-parchment-300",
                    "text-parchment-950 placeholder:text-parchment-400",
                    "focus:outline-none focus:border-sienna-600",
                    "transition-colors"
                  )}
                />
              </div>
              <div className="flex flex-col flex-1 sm:flex-none">
                <span className="text-[10px] text-parchment-500 mb-1 sm:hidden">Peso (kg)</span>
                <input
                  {...register(`exercises.${index}.weight`)}
                  type="number"
                  min={0}
                  step={0.5}
                  placeholder="—"
                  className={cn(
                    "h-9 w-full rounded-lg px-2 text-sm text-center",
                    "bg-parchment-200 border border-parchment-300",
                    "text-parchment-950 placeholder:text-parchment-400",
                    "focus:outline-none focus:border-sienna-600",
                    "transition-colors"
                  )}
                />
              </div>
              <div className="flex items-end sm:items-center">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  className="h-9 w-9 flex items-center justify-center rounded-lg text-parchment-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {errors.exercises?.root && (
        <p className="text-xs text-rose-600">{errors.exercises.root.message}</p>
      )}

      <button
        type="button"
        onClick={() => append({ name: "", sets: 3, reps: 10, weight: undefined })}
        className="flex items-center gap-2 text-sm text-parchment-500 hover:text-parchment-950 transition-colors py-1"
      >
        <Plus size={14} />
        Agregar ejercicio
      </button>

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
