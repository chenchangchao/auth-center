// scripts/test-db.ts
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });
config();

const databaseUrl = process.env.DATABASE_URL!;

if (!databaseUrl) {
  console.error("❌ Missing DATABASE_URL in .env.local or .env");
  process.exit(1);
}

try {
  new URL(databaseUrl);
} catch {
  console.error("❌ Invalid DATABASE_URL format.");
  console.error("If the password contains reserved URL characters like ?, %, @, or +, percent-encode them before the host.");
  process.exit(1);
}

function maskDatabaseUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = "****";
    }
    return parsed.toString();
  } catch {
    return "Invalid DATABASE_URL format";
  }
}

const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 1,
  idle_timeout: 5,
  connect_timeout: 10,
});

async function main() {
  console.log("🔎 Testing Supabase/PostgreSQL connection...");
  console.log("DATABASE_URL:", maskDatabaseUrl(databaseUrl));

  try {
    const nowResult = await sql`
      select
        now() as server_time,
        current_database() as database_name,
        current_user as current_user,
        version() as version
    `;

    console.log("✅ Database connected successfully.");
    console.table(nowResult);

    const schemaResult = await sql`
      select schema_name
      from information_schema.schemata
      where schema_name in ('public', 'auth')
      order by schema_name
    `;

    console.log("📦 Available useful schemas:");
    console.table(schemaResult);

    const tableResult = await sql`
      select table_schema, table_name
      from information_schema.tables
      where table_schema = 'public'
      order by table_name
      limit 20
    `;

    console.log("📋 Public tables:");
    console.table(tableResult);
  } catch (error) {
    console.error("❌ Database connection failed.");

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main();
