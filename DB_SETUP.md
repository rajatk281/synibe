# Database Setup Documentation

This document outlines the steps taken to set up the database using Neon (PostgreSQL) and Drizzle ORM in this Next.js project.

## 1. Dependencies Installation
The following essential packages were added to the project for database integration:
- **`drizzle-orm`**: The core ORM library.
- **`drizzle-kit`**: CLI tool for generating migrations and database management.
- **`@neondatabase/serverless`**: Serverless driver for connecting to Neon PostgreSQL.
- **`dotenv`**: For loading environment variables in the Drizzle config.

## 2. Environment Configuration
A `.env` file was configured at the root of the project containing the `DATABASE_URL` connection string from Neon.
```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
```

## 3. Database Connection Instance
Created `db/drizzle.ts` to initialize and export the Drizzle database instance:
```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
```

## 4. Schema Definition
Created `db/schema.ts` to define the database tables using Drizzle's PostgreSQL schema builder.
Example for the `rooms` table:
```typescript
import { integer, text, pgTable, uuid } from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  destName: text("Destination").notNull(),
  accessHash: text("Access Hash").notNull(),
  visibility: text("visibility", {enum: ["public", "private"]}).notNull().default("private"),
  participantLimit: integer("Participant Limit").notNull().default(10),
  creatorId: text("Creator ID").notNull()
});
```

## 5. Drizzle Kit Configuration
Configured `drizzle.config.ts` in the root directory to tell Drizzle Kit where to find the schema, where to output migrations, and how to connect to the database:
```typescript
import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

config({ path: '.env' });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## 6. Scripts Setup
Added helpful scripts to `package.json` for database management:
```json
"scripts": {
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate",
  "db:studio": "drizzle-kit studio"
}
```

## 7. Next.js Server Actions Integration
To interact with the database securely, Server Actions were created. Since `DATABASE_URL` is a server-only environment variable, database queries (like inserts) cannot be executed directly from Next.js Client Components (`"use client"`). 

Instead, queries are encapsulated in Server Actions (e.g., `app/create-room/new/actions.ts` with `"use server"` directive), and these actions are imported and called from Client Components.
```typescript
"use server";
import { db } from "@/db/drizzle";
import { rooms } from "@/db/schema";

export async function createRoom(data: { ... }) {
  await db.insert(rooms).values({ ... });
}
```
