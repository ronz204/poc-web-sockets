import { env } from "@env";
import { Elysia } from "elysia";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { UsersDao } from "@repos/users/user.dao";
import { RolesDao } from "@repos/roles/roles.dao";

export const PrismaPlugin = new Elysia({ name: "prisma.plugin" })
  .decorate(() => {
    const adapter = new PrismaPg({ connectionString: env.POSTGRES_URL });
    const prisma = new PrismaClient({ adapter });

    return {
      usersDao: new UsersDao(prisma),
      rolesDao: new RolesDao(prisma),
    };
  });
