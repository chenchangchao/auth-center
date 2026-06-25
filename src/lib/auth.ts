// src/lib/auth.ts
import "./server-proxy";
import { betterAuth } from "better-auth";
import { Kysely, PostgresDialect } from "kysely";

import { logAuthEvent } from "@/lib/auth-audit";
import { db as pool } from "@/lib/db";

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
  databaseHooks: {
    session: {
      create: {
        after: async (session, context) => {
          await logAuthEvent({
            userId: session.userId,
            eventType: "sign_in",
            provider: getLoginProvider(context),
            ip: session.ipAddress ?? getHeader(context, "x-forwarded-for"),
            userAgent: session.userAgent ?? getHeader(context, "user-agent"),
            metadata: {
              path: context?.path,
              sessionId: session.id,
            },
          });
        },
      },
    },
  },
});

function getLoginProvider(
  context: { path?: string; params?: { id?: string } } | null,
) {
  if (context?.path === "/sign-in/email") return "email";

  return context?.params?.id;
}

function getHeader(context: { request?: Request } | null, name: string) {
  return context?.request?.headers.get(name) ?? undefined;
}
