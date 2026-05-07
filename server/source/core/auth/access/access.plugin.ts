import { env } from "@env";
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AccessClaims, AccessHeaders } from "./access.schema";

export const AccessPlugin = new Elysia({ name: "access.plugin" })
  .use(jwt({
    name: "jwt",
    schema: AccessClaims,
    exp: env.ACCESS_TTL,
    secret: env.SECRET_KEY,
  }))

  .macro({
    withAuth: {
      headers: AccessHeaders,
      resolve: async ({ status, jwt, headers }) => {
        const status401 = status(401, "Unauthorized");

        const header = headers["authorization"];
        if (!header?.startsWith("Bearer ")) return status401;

        const claims = await jwt.verify(header.slice(7));
        if (!claims) return status401;

        return { claims };
      },
    },
  });
