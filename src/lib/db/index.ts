import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type DB = NeonHttpDatabase<typeof schema>;

let _db: DB | null = null;

/**
 * Returns the Drizzle DB instance, creating it on first call.
 * This lazy approach prevents Next.js from throwing during build-time
 * module loading when DATABASE_URL is not available.
 */
export function getDb(): DB {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url)
      throw new Error(
        "DATABASE_URL is not set. Add it to your .env.local file."
      );
    _db = drizzle(neon(url), { schema });
  }
  return _db;
}

/**
 * Proxy so that callers can write `db.select()` instead of `getDb().select()`.
 * The actual connection is only created on first use, not at import time.
 */
export const db = new Proxy({} as DB, {
  get(_, prop: string | symbol) {
    return (getDb() as any)[prop];
  },
});
