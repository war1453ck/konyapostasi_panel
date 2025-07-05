import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use a default database URL for development if none is provided
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:8587@localhost:5432/konyapostasi_panel";

export const pool = new pg.Pool({ connectionString: DATABASE_URL });
export const db = drizzle(pool, { schema });
