import { Elysia, status } from "elysia";
import { ScopesHandler } from "./scopes.handler";
import { RedisPlugin } from "@database/redis.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { AccessPlugin } from "@security/access/access.plugin";

export const ScopePlugin = new Elysia({ name: "scope.plugin" })
  .use(AccessPlugin)
  .use(PrismaPlugin)
  .use(RedisPlugin)

  .derive({ as: "global" }, ({ rolesDao, rolesCache }) => ({
    guarder: new ScopesHandler(rolesDao, rolesCache),
  }))

  .macro({
    hasScopes: (scopes: string[] = []) => ({
      resolve: async ({ claims, guarder }) => {
        const userScopes = await guarder.handle(claims);
        if (!scopes.every(s => userScopes.has(s))) {
          return status(403, "Forbidden");
        };
      },
    })
  });
