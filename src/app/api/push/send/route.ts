import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { db } from "@/db";
import { pushSubscription, habit } from "@/db/schema";
import { eq, and, isNotNull } from "drizzle-orm";

export async function GET(req: NextRequest) {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_CONTACT_EMAIL}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscriptions = await db.select().from(pushSubscription);
  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      const now = new Date();
      const userTime = now.toLocaleTimeString("en-GB", {
        timeZone: sub.timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const dueHabits = await db
        .select()
        .from(habit)
        .where(
          and(
            eq(habit.userId, sub.userId),
            eq(habit.isArchived, false),
            isNotNull(habit.reminderTime),
            eq(habit.reminderTime, userTime)
          )
        );

      if (dueHabits.length === 0) return;

      for (const h of dueHabits) {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            JSON.stringify({
              title: `⏰ ${h.name}`,
              body: "Es hora de tu hábito diario.",
              tag: `habit-${h.id}`,
              url: "/dashboard",
            })
          );
          sent++;
        } catch {
          failed++;
        }
      }
    })
  );

  return NextResponse.json({ sent, failed });
}
