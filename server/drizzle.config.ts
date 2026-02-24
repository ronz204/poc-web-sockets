import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./drizzle/Models/*",
  out: "./drizzle/Migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
