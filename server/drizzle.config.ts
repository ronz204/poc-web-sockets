import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./src/Infrastructure/Database/Drizzle",
  schema: "./src/Infrastructure/Database/Schemas",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
