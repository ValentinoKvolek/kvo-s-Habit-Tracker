import { z } from "zod";

export const SPORT_TYPES = ["gym", "running", "cycling", "swimming", "other"] as const;
export type SportType = (typeof SPORT_TYPES)[number];

export const SPORT_LABELS: Record<SportType, string> = {
  gym: "Gimnasio",
  running: "Running",
  cycling: "Ciclismo",
  swimming: "Natación",
  other: "Otro",
};

// ── Gym ────────────────────────────────────────────────────────────────────

export const exerciseSchema = z.object({
  name: z.string().min(1, "El nombre del ejercicio es requerido").max(80),
  sets: z.coerce.number().int().min(1).max(99),
  reps: z.coerce.number().int().min(1).max(999),
  weight: z.coerce.number().min(0).max(9999).optional(), // kg, optional (bodyweight)
});

export const gymWorkoutSchema = z.object({
  exercises: z.array(exerciseSchema).min(1, "Agregá al menos un ejercicio"),
  notes: z.string().max(500).optional(),
});

// ── Cardio ─────────────────────────────────────────────────────────────────

export const cardioWorkoutSchema = z.object({
  distance: z.coerce.number().min(0).max(9999).optional(), // km
  duration: z.coerce.number().int().min(0).max(1440).optional(), // minutes
  notes: z.string().max(500).optional(),
});

// ── Other ──────────────────────────────────────────────────────────────────

export const otherWorkoutSchema = z.object({
  notes: z.string().max(500).optional(),
});

// ── Types ───────────────────────────────────────────────────────────────────

export type ExerciseInput = z.infer<typeof exerciseSchema>;
export type GymWorkoutData = z.infer<typeof gymWorkoutSchema>;
export type CardioWorkoutData = z.infer<typeof cardioWorkoutSchema>;
export type OtherWorkoutData = z.infer<typeof otherWorkoutSchema>;
export type WorkoutData = GymWorkoutData | CardioWorkoutData | OtherWorkoutData;

// ── Helpers ─────────────────────────────────────────────────────────────────

export function isCardioType(sportType: string): boolean {
  return ["running", "cycling", "swimming"].includes(sportType);
}
