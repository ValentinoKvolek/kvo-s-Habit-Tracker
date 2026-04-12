"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  gymWorkoutSchema,
  cardioWorkoutSchema,
  otherWorkoutSchema,
  isCardioType,
  type GymWorkoutData,
  type CardioWorkoutData,
  type OtherWorkoutData,
  type WorkoutData,
} from "@/lib/validations/workout.schema";
import { saveWorkoutLog } from "@/lib/actions/workout.actions";
import { cn } from "@/lib/utils/cn";
import { toast } from "sonner";
import { Plus, Trash2, Save, Timer, Route, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDisplayDate } from "@/lib/utils/dates";
import type { WorkoutLogEntry } from "@/lib/queries/habit.queries";

interface WorkoutLoggerProps {
  habitId: string;
  sportType: string;
  date: string; // "YYYY-MM-DD"
  initialData: WorkoutData | null;
  history: WorkoutLogEntry[];
}

// ── Session Picker ───────────────────────────────────────────────────────────

function SessionPicker<T extends WorkoutData>({
  history,
  onLoad,
}: {
  history: WorkoutLogEntry[];
  onLoad: (data: T) => void;
}) {
  if (history.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mb-5 px-3 py-2.5 bg-parchment-100 border border-parchment-300 rounded-xl">
      <ClipboardList size={14} className="text-parchment-400 flex-shrink-0" />
      <select
        defaultValue=""
        className="flex-1 text-sm bg-transparent text-parchment-700 focus:outline-none cursor-pointer"
        onChange={(e) => {
          const log = history.find((l) => l.id === e.target.value);
          if (log) onLoad(log.data as T);
          e.target.value = "";
        }}
      >
        <option value="" disabled>
          Cargar sesión anterior...
        </option>
        {history.map((log) => {
          const data = log.data as { sessionName?: string };
          const dateLabel = formatDisplayDate(log.date, {
            weekday: "long",
            day: "numeric",
            month: "short",
          });
          return (
            <option key={log.id} value={log.id}>
              {data.sessionName ? `${data.sessionName} — ${dateLabel}` : dateLabel}
            </option>
          );
        })}
      </select>
    </div>
  );
}

// ── Gym Logger ──────────────────────────────────────────────────────────────

function GymLogger({
  habitId,
  date,
  initialData,
  history,
}: {
  habitId: string;
  date: string;
  initialData: GymWorkoutData | null;
  history: WorkoutLogEntry[];
}) {
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

      {/* Session name */}
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

      {/* Column headers */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_64px_64px_72px_36px] gap-2 px-1">
        <span className="text-[10px] text-parchment-500 uppercase tracking-wider">Ejercicio</span>
        <span className="text-[10px] text-parchment-500 uppercase tracking-wider text-center">Series</span>
        <span className="text-[10px] text-parchment-500 uppercase tracking-wider text-center">Reps</span>
        <span className="text-[10px] text-parchment-500 uppercase tracking-wider text-center">Peso (kg)</span>
        <span />
      </div>

      {/* Exercise rows */}
      <div className="flex flex-col gap-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col sm:grid sm:grid-cols-[1fr_64px_64px_72px_36px] gap-2 bg-parchment-100 border border-parchment-300 rounded-xl p-3 sm:p-2">
            {/* Name */}
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
              {/* Sets */}
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
              {/* Reps */}
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
              {/* Weight */}
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
              {/* Remove */}
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

      {/* Add exercise */}
      <button
        type="button"
        onClick={() => append({ name: "", sets: 3, reps: 10, weight: undefined })}
        className="flex items-center gap-2 text-sm text-parchment-500 hover:text-parchment-950 transition-colors py-1"
      >
        <Plus size={14} />
        Agregar ejercicio
      </button>

      {/* Notes */}
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

// ── Cardio Logger ───────────────────────────────────────────────────────────

function CardioLogger({
  habitId,
  date,
  initialData,
  history,
}: {
  habitId: string;
  date: string;
  initialData: CardioWorkoutData | null;
  history: WorkoutLogEntry[];
}) {
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

      {/* Session name */}
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
        {/* Distance */}
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

        {/* Duration */}
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

      {/* Notes */}
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

// ── Other Logger ────────────────────────────────────────────────────────────

function OtherLogger({
  habitId,
  date,
  initialData,
  history,
}: {
  habitId: string;
  date: string;
  initialData: OtherWorkoutData | null;
  history: WorkoutLogEntry[];
}) {
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

      {/* Session name */}
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

// ── Main Component ──────────────────────────────────────────────────────────

export function WorkoutLogger({ habitId, sportType, date, initialData, history }: WorkoutLoggerProps) {
  // Exclude today from the template picker — today's data is already in the form
  const pastSessions = history.filter((l) => l.date !== date);

  return (
    <div className="bg-parchment-200 border border-parchment-300 rounded-2xl p-5">
      <h2 className="text-sm font-medium text-parchment-500 uppercase tracking-wider mb-4">
        Registrar sesión de hoy
      </h2>

      {sportType === "gym" ? (
        <GymLogger
          habitId={habitId}
          date={date}
          initialData={initialData as GymWorkoutData | null}
          history={pastSessions}
        />
      ) : isCardioType(sportType) ? (
        <CardioLogger
          habitId={habitId}
          date={date}
          initialData={initialData as CardioWorkoutData | null}
          history={pastSessions}
        />
      ) : (
        <OtherLogger
          habitId={habitId}
          date={date}
          initialData={initialData as OtherWorkoutData | null}
          history={pastSessions}
        />
      )}
    </div>
  );
}
