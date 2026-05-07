import { env } from "@env";
import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { UserDao } from "@dal/users/user.dao";
import { ScopeDao } from "@dal/scopes/scope.dao";

export const PrismaPlugin = new Elysia({ name: "prisma.plugin" })
  .decorate(() => {
    const adapter = new PrismaPg({ connectionString: env.POSTGRES_URL });
    const prisma = new PrismaClient({ adapter });

    return {
      userDao: new UserDao(prisma),
      scopeDao: new ScopeDao(prisma),
    };
  });
