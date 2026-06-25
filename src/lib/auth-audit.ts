// src/lib/auth-audit.ts
import { db } from "./db";

export async function logAuthEvent(params: {
  userId?: string;
  email?: string;
  eventType: string;
  provider?: string;
  ip?: string;
  userAgent?: string;
  success?: boolean;
  metadata?: unknown;
}) {
  try {
    const provider = normalizeProvider(params.provider);
    const { rows } = await db.query<{
      email: string | null;
      provider: string | null;
    }>(
      `
        select
          u.email,
          a."providerId" as provider
        from "user" u
        left join lateral (
          select "providerId"
          from "account"
          where "userId" = u.id
          order by "updatedAt" desc, "createdAt" desc
          limit 1
        ) a on true
        where u.id = $1
      `,
      [params.userId],
    );

    const user = rows[0];

    await db.query(
      `
        insert into auth_events (
          user_id,
          email,
          event_type,
          provider,
          ip,
          user_agent,
          success,
          metadata
        ) values ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [
        params.userId ?? null,
        params.email ?? user?.email ?? null,
        params.eventType,
        provider ?? normalizeProvider(user?.provider) ?? null,
        params.ip ?? null,
        params.userAgent ?? null,
        params.success ?? true,
        params.metadata ?? {},
      ],
    );
  } catch (e) {
    console.error("auth log failed:", e);
  }
}

function normalizeProvider(provider: string | null | undefined) {
  if (!provider) return undefined;
  if (provider === "credential") return "email";

  return provider;
}
