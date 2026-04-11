import { z } from "zod";

export const HABIT_COLORS = [
  "violet",
  "blue",
  "teal",
  "green",
  "amber",
  "rose",
  "orange",
  "indigo",
] as const;

export const HABIT_ICONS = [
  "book",
  "dumbbell",
  "heart",
  "droplets",
  "moon",
  "sun",
  "brain",
  "music",
  "code",
  "pen",
  "running",
  "salad",
  "piggy-bank",
  "star",
] as const;

export const HABIT_CATEGORIES = ["general", "sport", "study", "health"] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  sport: "Deporte",
  study: "Estudio",
  health: "Salud",
};

export const habitSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(60, "El nombre no puede superar los 60 caracteres"),
  description: z
    .string()
    .max(200, "La descripción no puede superar los 200 caracteres")
    .optional(),
  icon: z.enum(HABIT_ICONS).default("star"),
  color: z.enum(HABIT_COLORS).default("violet"),
  frequency: z.enum(["daily", "weekly", "monthly", "custom"]).default("daily"),
  frequencyDays: z.string().optional(), // "0,1,5"
  targetCount: z.coerce.number().int().min(1).max(100).default(1),
  category: z.enum(HABIT_CATEGORIES).default("general"),
  sportType: z.string().optional(),
})
  .superRefine((data, ctx) => {
    if (data.category === "sport" && !data.sportType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seleccioná un tipo de deporte",
        path: ["sportType"],
      });
    }
  });

export type HabitInput = z.infer<typeof habitSchema>;
