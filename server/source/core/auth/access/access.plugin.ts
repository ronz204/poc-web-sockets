import { env } from "@env";
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AccessHandler } from "./access.handler";
import { RedisPlugin } from "@database/redis.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";
import { AccessClaims, AccessHeaders } from "./access.schema";

export const AccessPlugin = new Elysia({ name: "access.plugin" })
  .use(RedisPlugin)
  .use(PrismaPlugin)

  .use(jwt({
    name: "jwt",
    schema: AccessClaims,
    exp: env.ACCESS_TTL,
    secret: env.SECRET_KEY,
  }))

  .macro({
    withAuth: (scopes: string[] = []) => ({
      headers: AccessHeaders,
      resolve: async ({ status, jwt, headers, roleDao, rolesCache }) => {
        const header = headers["authorization"];
        
        if (!header?.startsWith("Bearer ")) {
          return status(401, "Unauthorized");
        };

        const claims = await jwt.verify(header.slice(7));
        if (!claims) return status(401, "Unauthorized");

        if (scopes.length > 0) {
          const handler = new AccessHandler(roleDao, rolesCache);
          const userScopes = await handler.handle(claims);

          if (!scopes.every(s => userScopes.has(s))) {
            return status(403, "Forbidden");
          };
        };

        return { claims };
      },
    }),
  });
