/**
 * One-time migration: sets category = 'sport' for all habits where isSport = true.
 * Run once after db:push with: node --env-file .env.local -e "import('./src/lib/db/migrations/migrate-is-sport.ts')"
 * Or via: npm run db:migrate-sport
 */
import { Pool } from "pg";

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const { rows } = await pool.query<{ count: string }>(
    `UPDATE habit SET category = 'sport' WHERE "is_sport" = true AND category = 'general' RETURNING id`
  );

  console.log(`Updated ${rows.length} habit(s) to category = 'sport'.`);
  await pool.end();
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
