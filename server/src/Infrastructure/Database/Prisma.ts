import { PrismaClient } from "@Generated/prisma/client";
import { PrismaConfig } from "@Configs/PrismaConfig";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: PrismaConfig.url,
});

export const Prisma = new PrismaClient({ adapter });
