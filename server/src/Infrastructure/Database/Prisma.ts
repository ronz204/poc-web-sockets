import { PrismaClient } from "@Generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URL!,
});

export const Prisma = new PrismaClient({ adapter });
