

import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

// Check DATABASE_URL first
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the .env file');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
export { sql };

async function runMigrations() {
    try {
        const sql = neon(process.env.DATABASE_URL!);
        const db = drizzle(sql);
        
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log("Migrations completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}
