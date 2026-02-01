import { drizzle } from "drizzle-orm/node-postgres";
export const Drizz = drizzle(process.env.DATABASE_URL!);