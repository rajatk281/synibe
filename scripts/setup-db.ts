import { config } from "dotenv";
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function setup() {
  console.log("Creating rooms table...");
  await sql`
    CREATE TABLE IF NOT EXISTS "rooms" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "Destination" text NOT NULL,
      "Access Hash" text NOT NULL,
      "visibility" text DEFAULT 'private' NOT NULL,
      "Participant Limit" integer DEFAULT 10 NOT NULL,
      "Creator ID" text NOT NULL,
      "Video URL" text DEFAULT '' NOT NULL,
      CONSTRAINT "rooms_id_unique" UNIQUE("id")
    )
  `;
  console.log("✅ rooms table ready");

  console.log("Creating users table...");
  await sql`
    CREATE TABLE IF NOT EXISTS "users" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "name" text NOT NULL,
      "email" text NOT NULL UNIQUE,
      "image" text,
      "role" text NOT NULL DEFAULT 'user',
      "welcome_email_sent" boolean NOT NULL DEFAULT false,
      "created_at" timestamp NOT NULL DEFAULT now()
    )
  `;
  console.log("✅ users table ready");

  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  console.log("📋 All tables:", tables.map((r: any) => r.table_name as string));
}

setup().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

