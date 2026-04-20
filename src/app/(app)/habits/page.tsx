import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { habitEntry } from "@/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { getHabitsWithTodayEntries } from "@/features/habits/queries";
import { getTodayString } from "@/lib/dates";
import { HabitsOverview } from "./_components/habits-overview";

export const metadata = { title: "Hábitos — Constantia" };

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
    );
  }
  return days;
}

export default async function HabitsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const today = getTodayString();
  const last7Days = getLast7Days();
  const sevenDaysAgo = last7Days[0];

  const [habits, weekEntries] = await Promise.all([
    getHabitsWithTodayEntries(session.user.id),
    db
      .select()
      .from(habitEntry)
      .where(
        and(eq(habitEntry.userId, session.user.id), gte(habitEntry.date, sevenDaysAgo))
      ),
  ]);

  const habitData = habits.map((h) => {
    const entries = weekEntries.filter((e) => e.habitId === h.id);
    const weekCompletion = last7Days.map((day) => {
      const entry = entries.find((e) => e.date === day);
      return entry ? entry.count >= h.targetCount : false;
    });
    return {
      id: h.id,
      name: h.name,
      color: h.color,
      category: h.category,
      currentStreak: h.currentStreak,
      virtusScore: h.virtusScore,
      isCompletedToday: h.isCompletedToday,
      weekCompletion,
    };
  });

  const completedToday = habitData.filter((h) => h.isCompletedToday).length;
  const totalToday = habitData.length;

  return (
    <HabitsOverview
      habits={habitData}
      completedToday={completedToday}
      totalToday={totalToday}
      last7Days={last7Days}
      userName={session.user.name.split(" ")[0]}
    />
  );
}
