"use client";

import {
  isCardioType,
  type GymWorkoutData,
  type CardioWorkoutData,
  type OtherWorkoutData,
  type WorkoutData,
} from "@/features/workouts/schema";
import { GymForm } from "./gym-form";
import { CardioForm } from "./cardio-form";
import { OtherForm } from "./other-form";
import type { WorkoutLogEntry } from "@/features/workouts/queries";

interface WorkoutLoggerProps {
  habitId: string;
  sportType: string;
  date: string;
  initialData: WorkoutData | null;
  history: WorkoutLogEntry[];
}

export function WorkoutLogger({ habitId, sportType, date, initialData, history }: WorkoutLoggerProps) {
  const pastSessions = history.filter((l) => l.date !== date);

  return (
    <div className="bg-parchment-200 border border-parchment-300 rounded-2xl p-5">
      <h2 className="text-sm font-medium text-parchment-500 uppercase tracking-wider mb-4">
        Registrar sesión de hoy
      </h2>

      {sportType === "gym" ? (
        <GymForm
          habitId={habitId}
          date={date}
          initialData={initialData as GymWorkoutData | null}
          history={pastSessions}
        />
      ) : isCardioType(sportType) ? (
        <CardioForm
          habitId={habitId}
          date={date}
          initialData={initialData as CardioWorkoutData | null}
          history={pastSessions}
        />
      ) : (
        <OtherForm
          habitId={habitId}
          date={date}
          initialData={initialData as OtherWorkoutData | null}
          history={pastSessions}
        />
      )}
    </div>
  );
}
