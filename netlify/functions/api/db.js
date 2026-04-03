import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import "dotenv/config";

// Setup connection string (will be available via `.env` locally or Netlify Environment Variables in production)
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL in environment for Postgres connection.");
}

// Initialize the postgres client
// Used standard configuration optimized for Supabase connection pooling
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
