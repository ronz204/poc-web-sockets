import { env } from "@env";
import { jwt } from "@elysiajs/jwt";
import { Elysia, status } from "elysia";

import { AccessClaims } from "./access.schema";
import { AccessHeaders } from "./access.schema";
import { AccessHandler } from "./access.handler";

import { RedisPlugin } from "@database/redis.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";

export const AccessDriver = new Elysia({ name: "access.driver" })
  .use(RedisPlugin)
  .use(PrismaPlugin)

  .decorate(({ rolesDao, rolesCache }) => ({
    guard: new AccessHandler(rolesDao, rolesCache),
  }))

  .use(jwt({
    name: "jwt",
    schema: AccessClaims,
    exp: env.ACCESS_TTL,
    secret: env.SECRET_KEY,
  }))

  .macro({
    isAuth: (scopes: string[] = []) => ({
      headers: AccessHeaders,
      resolve: async ({ headers, jwt, guard }) => {
        const header = headers["authorization"];

        if (!header?.startsWith("Bearer ")) {
          return status(401, "Unauthorized");
        };

        const claims = await jwt.verify(header.slice(7));
        if (!claims) return status(401, "Unauthorized");

        const userScopes = await guard.handle(claims);
        if (!scopes.every(s => userScopes.has(s))) {
          return status(403, "Forbidden");
        };

        return { claims };
      },
    }),
  });
