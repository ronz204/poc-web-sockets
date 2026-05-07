import { env } from "@env";
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
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
      resolve: async ({ status, jwt, headers, roleDao, scopesCache }) => {
        const header = headers["authorization"];
        if (!header?.startsWith("Bearer ")) return status(401, "Unauthorized");

        const claims = await jwt.verify(header.slice(7));
        if (!claims) return status(401, "Unauthorized");

        if (scopes.length > 0) {
          const userScopes = new Set<string>();

          for (const role of claims.roles) {
            let roleScopes = await scopesCache.get(role);

            if (!roleScopes) {
              const rows = await roleDao.getScopes({ role });
              roleScopes = rows.map(s => s.name);
              await scopesCache.set(role, roleScopes);
            };

            for (const scope of roleScopes) userScopes.add(scope);
          };

          if (!scopes.every(s => userScopes.has(s))) return status(403, "Forbidden");
        };

        return { claims };
      },
    }),
  });
