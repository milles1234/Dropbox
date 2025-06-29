import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';


if(!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the .env file');
}

export default defineConfig({
  out: './drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "__drizzle_migrations",
    schema: "public"
  },
  verbose: true,
  strict: true,
});
