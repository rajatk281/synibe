import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!)
// console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
// console.log("DATABASE_URL prefix:", process.env.DATABASE_URL?.slice(0, 30));
export const db = drizzle({client : sql});
