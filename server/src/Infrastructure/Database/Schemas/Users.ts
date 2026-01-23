import { sqliteTable } from "drizzle-orm/sqlite-core";
import { pgTable } from "drizzle-orm/pg-core";

export const Users = pgTable("users", (t) => ({
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar().notNull().unique(),
  email: t.varchar().notNull().unique(),
  password: t.varchar().notNull(),
}));
