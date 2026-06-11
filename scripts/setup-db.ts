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

  console.log("✅ rooms table created (or already exists)");

  // Verify
  const result = await sql`SELECT COUNT(*) FROM "rooms"`;
  console.log("✅ Table verified. Row count:", result[0].count);
}

setup().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
