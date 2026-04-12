"use client";

import { useEffect, useRef } from "react";

interface HabitReminder {
  id: string;
  name: string;
  reminderTime: string; // "HH:MM"
}

export function ReminderChecker({ habits }: { habits: HabitReminder[] }) {
  // Track which reminders already fired today so we don't repeat
  const firedTodayRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request permission proactively on mount so the user is prompted
    // even when no habit is due right now.
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }

    if (habits.length === 0) return;

    async function check() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hh}:${mm}`;
      const todayKey = `${now.toDateString()}`;

      // Reset fired set on a new day
      if (!firedTodayRef.current.has(`__date__${todayKey}`)) {
        firedTodayRef.current = new Set([`__date__${todayKey}`]);
      }

      const dueHabits = habits.filter(
        (h) =>
          h.reminderTime === currentTime &&
          !firedTodayRef.current.has(h.id)
      );

      if (dueHabits.length === 0) return;

      if (Notification.permission !== "granted") return;

      for (const habit of dueHabits) {
        new Notification(`⏰ ${habit.name}`, {
          body: "Es hora de tu hábito diario.",
          icon: "/logo.png",
          tag: `habit-reminder-${habit.id}`,
        });
        firedTodayRef.current.add(habit.id);
      }
    }

    // Check immediately, then every 30s for accuracy
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [habits]);

  return null;
}
