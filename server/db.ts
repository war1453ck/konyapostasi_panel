import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use a default database URL for development if none is provided
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/konyapostasi_panel";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });
