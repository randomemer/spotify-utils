import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/database/schema.ts",
  out: "./server/database/migrations",
  driver: "mysql2",
  dbCredentials: { uri: process.env.DB_URL!! },
  verbose: true,
  strict: true,
});
