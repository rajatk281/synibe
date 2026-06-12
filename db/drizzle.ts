import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql, schema });
// console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
// console.log("DATABASE_URL prefix:", process.env.DATABASE_URL?.slice(0, 30));
