import { defineConfig } from "drizzle-kit";

// Use a default database URL for development if none is provided
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:8587@localhost:5432/konyapostasi_panel";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
