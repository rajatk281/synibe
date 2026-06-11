import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
const dbwait = async()=>{
    const sql = neon(process.env.DATABASE_URL!)
    return drizzle({client : sql});
}

export const db = await dbwait();
// console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
// console.log("DATABASE_URL prefix:", process.env.DATABASE_URL?.slice(0, 30));
