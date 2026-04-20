import { getTodayString, getDateString } from "@/lib/dates";

/**
 * Calculates the current streak from an array of completion date strings ("YYYY-MM-DD").
 * A streak is broken if there's no entry for yesterday (or today if none yet today).
 */
export function calculateCurrentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const dateSet = new Set(dates);
  const today = getTodayString();
  const yesterday = getDateString(-1);

  // If neither today nor yesterday is completed, streak is 0
  if (!dateSet.has(today) && !dateSet.has(yesterday)) return 0;

  let streak = 0;
  // Start from today and go backwards
  const startFrom = dateSet.has(today) ? 0 : -1;

  for (let i = startFrom; i >= -3650; i--) {
    const dateStr = getDateString(i);
    if (dateSet.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculates the longest ever streak from an array of completion date strings.
 */
export function calculateLongestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  // Sort ascending
  const sorted = [...dates].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00`);
    const curr = new Date(`${sorted[i]}T00:00:00`);
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (diffDays > 1) {
      current = 1;
    }
    // diffDays === 0 means duplicate date — skip
  }

  return longest;
}

/**
 * Returns the completion rate as a percentage (0–100) for the last N days.
 */
export function getCompletionRate(dates: string[], days: number = 7): number {
  const dateSet = new Set(dates);
  let count = 0;
  for (let i = 0; i < days; i++) {
    if (dateSet.has(getDateString(-i))) count++;
  }
  return Math.round((count / days) * 100);
}

/**
 * Calculates a 0–1000 consistency score using an exponential decay model.
 * C_t = C_(t-1) × 0.985 + (completed ? 15 : 0)
 * Converges to 1000 on perfect consistency (15 / 0.015 = 1000).
 * With perfect consistency: rank 1 (~10 days), rank 5 (~2 months), rank 9 (~6 months).
 * Dates before habitCreatedAt are excluded so retroactive entries don't
 * inflate the score for days the habit didn't exist yet.
 */
export function calculateVirtusScore(
  completedDates: string[],
  habitCreatedAt?: Date
): number {
  const createdStr = habitCreatedAt
    ? `${habitCreatedAt.getFullYear()}-${String(habitCreatedAt.getMonth() + 1).padStart(2, "0")}-${String(habitCreatedAt.getDate()).padStart(2, "0")}`
    : null;

  const validDates = createdStr
    ? completedDates.filter((d) => d >= createdStr)
    : completedDates;

  if (validDates.length === 0) return 0;

  const dateSet = new Set(validDates);
  const today = getTodayString();
  const earliest = createdStr
    ? (createdStr > [...validDates].sort()[0] ? createdStr : [...validDates].sort()[0])
    : [...validDates].sort()[0];

  let score = 0;
  const cursor = new Date(`${earliest}T00:00:00`);
  const end = new Date(`${today}T00:00:00`);

  while (cursor <= end) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const d = String(cursor.getDate()).padStart(2, "0");
    score = score * 0.985 + (dateSet.has(`${y}-${m}-${d}`) ? 15 : 0);
    cursor.setDate(cursor.getDate() + 1);
  }

  return Math.min(1000, Math.round(score));
}

export const VIRTUS_MAX = 1000;

export type VirtusRank = {
  philosopher: string;
  title: string;
  description: string;
};

export function getVirtusRank(score: number): VirtusRank {
  if (score >= 1000) return {
    philosopher: "El Sabio Estoico",
    title: "La perfección aspirada",
    description: "El ideal que los estoicos describían como casi inalcanzable. Razón y virtud en perfecta armonía.",
  };
  if (score >= 900) return {
    philosopher: "Zenón de Citio",
    title: "El Fundador",
    description: "Fundó la escuela estoica en el Pórtico Pintado de Atenas. Su constancia nació de un naufragio.",
  };
  if (score >= 800) return {
    philosopher: "Posidonio",
    title: "El Polímata",
    description: "Sintetizó filosofía, ciencia e historia. Para él, la virtud exigía comprender el cosmos entero.",
  };
  if (score >= 700) return {
    philosopher: "Catón de Útica",
    title: "La Virtud Inquebrantable",
    description: "Prefirió morir antes que ceder sus principios. Ninguna presión lo desvió de su camino.",
  };
  if (score >= 600) return {
    philosopher: "Marco Aurelio",
    title: "El Emperador Filósofo",
    description: "Gobernó el Imperio Romano 19 años aplicando el estoicismo cada día, sin excepciones.",
  };
  if (score >= 500) return {
    philosopher: "Epicteto",
    title: "El Maestro Liberto",
    description: "Esclavo que se convirtió en maestro. La libertad está en dominar lo que depende de ti.",
  };
  if (score >= 400) return {
    philosopher: "Musonio Rufo",
    title: "El Sócrates Romano",
    description: "Exiliado dos veces, nunca dejó de enseñar. La filosofía no es teoría, es práctica diaria.",
  };
  if (score >= 300) return {
    philosopher: "Séneca",
    title: "El Filósofo Práctico",
    description: "Escribía cartas diarias sobre la virtud. Cada día bien vivido era suficiente.",
  };
  if (score >= 200) return {
    philosopher: "Crisipo",
    title: "El Sistematizador",
    description: "Escribió más de 700 obras para construir la lógica estoica. Disciplina por encima del talento.",
  };
  if (score >= 100) return {
    philosopher: "Cleantes",
    title: "El Discípulo Fiel",
    description: "Cargó agua de noche para pagar sus estudios. Sin brillantez especial, solo constancia pura.",
  };
  if (score > 0) return {
    philosopher: "Aspirante",
    title: "En el umbral de la virtud",
    description: "El primer paso es el más difícil. Zenón también comenzó desde cero.",
  };
  return {
    philosopher: "—",
    title: "Sin rango",
    description: "Completa tu primer hábito para comenzar tu camino estoico.",
  };
}

export function getVirtusColor(score: number): string {
  if (score >= 850) return "#b07a30";
  if (score >= 600) return "#8b6914";
  if (score >= 350) return "#7a6b52";
  return "#a09080";
}

/**
 * Milestone streak values for special animations.
 */
export const STREAK_MILESTONES = [3, 7, 14, 21, 30, 60, 100, 365];

export function isStreakMilestone(streak: number): boolean {
  return STREAK_MILESTONES.includes(streak);
}
