import { z } from "zod";

export const studyLogSchema = z.object({
  sessions: z.number().int().min(1).max(100),
  totalMinutes: z.number().int().min(1).max(1440),
});

export type StudyLogInput = z.infer<typeof studyLogSchema>;
