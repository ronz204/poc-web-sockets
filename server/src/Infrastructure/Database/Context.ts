import { drizzle } from "drizzle-orm/bun-sqlite";
export const Drizz = drizzle(process.env.DATABASE_URL!);
