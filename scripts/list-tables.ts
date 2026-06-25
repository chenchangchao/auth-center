// scripts/list-tables.ts
import "dotenv/config";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const sql = postgres(databaseUrl, {
  ssl: "require",
  max: 1,
});

async function main() {
  const tables = await sql`
    select table_schema, table_name
    from information_schema.tables
    where table_schema = 'public'
    order by table_name;
  `;

  console.table(tables);
  await sql.end();
}

main().catch(async (err) => {
  console.error(err);
  await sql.end();
  process.exit(1);
});