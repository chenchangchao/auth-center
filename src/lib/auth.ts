// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: databaseUrl,
  options: "-c search_path=public",
  ssl: databaseUrl.includes("localhost")
    ? undefined
    : {
        rejectUnauthorized: false,
      },
});

const db = new Kysely({
  dialect: new PostgresDialect({ pool }),
});

const socialProviders = {
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
};

export const auth = betterAuth({
  database: {
    db,
    type: "postgres",
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
});
