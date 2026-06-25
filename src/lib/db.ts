// src/lib/db.ts
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10_000,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 30_000,
  options: "-c search_path=public",
  ssl: process.env.DATABASE_URL.includes("localhost")
    ? undefined
    : {
        rejectUnauthorized: false,
      },
});
