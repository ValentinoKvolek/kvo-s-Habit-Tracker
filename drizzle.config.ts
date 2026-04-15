import type { Config } from "drizzle-kit";

const url = process.env.DATABASE_URL!;
const isLocal = url?.includes("localhost") || url?.includes("127.0.0.1");

export default {
  schema: "./src/db/schema/index.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url,
    ...(isLocal ? {} : { ssl: "require" }),
  },
} satisfies Config;
