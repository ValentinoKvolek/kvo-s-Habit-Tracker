"use client";

import { useState } from "react";
import { formatShortDate } from "@/lib/utils/dates";
import { isCardioType } from "@/lib/validations/workout.schema";
import { Dumbbell, PersonStanding, Bike, Waves, MoreHorizontal, Route, Timer } from "lucide-react";
import type { WorkoutLogEntry } from "@/lib/queries/habit.queries";
import type { GymWorkoutData, CardioWorkoutData } from "@/lib/validations/workout.schema";

interface WorkoutHistoryProps {
  logs: WorkoutLogEntry[];
  sportType: string;
}

const SPORT_ICONS: Record<string, React.ElementType> = {
  gym: Dumbbell,
  running: PersonStanding,
  cycling: Bike,
  swimming: Waves,
  other: MoreHorizontal,
};

function GymLogCard({ log }: { log: WorkoutLogEntry }) {
  const data = log.data as GymWorkoutData;
  const Icon = SPORT_ICONS.gym;

  return (
    <div className="bg-parchment-100 border border-parchment-300 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={13} className="text-parchment-500 flex-shrink-0" />
        <div className="flex items-baseline gap-2 min-w-0">
          {data.sessionName && (
            <span className="text-xs font-semibold text-parchment-950 truncate">
              {data.sessionName}
            </span>
          )}
          <span className="text-xs text-parchment-500 flex-shrink-0">
            {formatShortDate(log.date)}
          </span>
        </div>
      </div>

      <table className="w-full text-xs">
        <thead>
          <tr className="text-parchment-500">
            <th className="text-left font-medium pb-1.5 pr-2">Ejercicio</th>
            <th className="text-center font-medium pb-1.5 px-1 w-12">Series</th>
            <th className="text-center font-medium pb-1.5 px-1 w-12">Reps</th>
            <th className="text-center font-medium pb-1.5 pl-1 w-16">Peso</th>
          </tr>
        </thead>
        <tbody>
          {data.exercises.map((ex, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-parchment-200/60" : ""}
            >
              <td className="py-1.5 pr-2 text-parchment-950 rounded-l-md pl-1">{ex.name}</td>
              <td className="py-1.5 px-1 text-center text-parchment-700">{ex.sets}</td>
              <td className="py-1.5 px-1 text-center text-parchment-700">{ex.reps}</td>
              <td className="py-1.5 pl-1 text-center text-parchment-500 rounded-r-md">
                {ex.weight != null ? `${ex.weight} kg` : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.notes && (
        <p className="text-xs text-parchment-500 mt-3 italic">{data.notes}</p>
      )}
    </div>
  );
}

function CardioLogCard({ log, sportType }: { log: WorkoutLogEntry; sportType: string }) {
  const data = log.data as CardioWorkoutData;
  const Icon = SPORT_ICONS[sportType] ?? SPORT_ICONS.other;

  return (
    <div className="bg-parchment-100 border border-parchment-300 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={13} className="text-parchment-500 flex-shrink-0" />
        <div className="flex items-baseline gap-2 min-w-0">
          {data.sessionName && (
            <span className="text-xs font-semibold text-parchment-950 truncate">
              {data.sessionName}
            </span>
          )}
          <span className="text-xs text-parchment-500 flex-shrink-0">
            {formatShortDate(log.date)}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        {data.distance != null && (
          <div className="flex items-center gap-1.5 bg-parchment-200 border border-parchment-300 rounded-lg px-3 py-2">
            <Route size={12} className="text-parchment-500" />
            <span className="text-sm font-semibold text-parchment-950">{data.distance}</span>
            <span className="text-xs text-parchment-500">km</span>
          </div>
        )}
        {data.duration != null && (
          <div className="flex items-center gap-1.5 bg-parchment-200 border border-parchment-300 rounded-lg px-3 py-2">
            <Timer size={12} className="text-parchment-500" />
            <span className="text-sm font-semibold text-parchment-950">{data.duration}</span>
            <span className="text-xs text-parchment-500">min</span>
          </div>
        )}
        {data.distance == null && data.duration == null && (
          <p className="text-xs text-parchment-500">Sin datos registrados</p>
        )}
      </div>

      {data.notes && (
        <p className="text-xs text-parchment-500 mt-3 italic">{data.notes}</p>
      )}
    </div>
  );
}

function OtherLogCard({ log }: { log: WorkoutLogEntry }) {
  const data = log.data as { sessionName?: string; notes?: string };
  const Icon = SPORT_ICONS.other;

  return (
    <div className="bg-parchment-100 border border-parchment-300 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="text-parchment-500 flex-shrink-0" />
        <div className="flex items-baseline gap-2 min-w-0">
          {data.sessionName && (
            <span className="text-xs font-semibold text-parchment-950 truncate">
              {data.sessionName}
            </span>
          )}
          <span className="text-xs text-parchment-500 flex-shrink-0">
            {formatShortDate(log.date)}
          </span>
        </div>
      </div>
      {data.notes ? (
        <p className="text-sm text-parchment-700">{data.notes}</p>
      ) : (
        <p className="text-xs text-parchment-400 italic">Sin notas</p>
      )}
    </div>
  );
}

export function WorkoutHistory({ logs, sportType }: WorkoutHistoryProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? logs : logs.slice(0, 5);

  return (
    <div className="bg-parchment-200 border border-parchment-300 rounded-2xl p-5">
      <h2 className="text-sm font-medium text-parchment-500 uppercase tracking-wider mb-4">
        Historial de sesiones
      </h2>

      {logs.length === 0 ? (
        <p className="text-sm text-parchment-500 text-center py-4">
          Todavía no hay sesiones registradas. ¡Empezá hoy!
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map((log) =>
            sportType === "gym" ? (
              <GymLogCard key={log.id} log={log} />
            ) : isCardioType(sportType) ? (
              <CardioLogCard key={log.id} log={log} sportType={sportType} />
            ) : (
              <OtherLogCard key={log.id} log={log} />
            )
          )}

          {logs.length > 5 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-sm text-parchment-500 hover:text-parchment-950 transition-colors pt-2"
            >
              {showAll ? "Mostrar menos" : `Ver ${logs.length - 5} más`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
