import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { pushSubscription } from "@/db/schema";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { endpoint, keys, timezone } = await req.json();

  await db
    .insert(pushSubscription)
    .values({
      userId: session.user.id,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      timezone: timezone ?? "UTC",
    })
    .onConflictDoUpdate({
      target: pushSubscription.endpoint,
      set: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        timezone: timezone ?? "UTC",
      },
    });

  return NextResponse.json({ ok: true });
}
