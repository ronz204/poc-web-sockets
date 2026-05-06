import { env } from "@env";
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { TokenSchema } from "@auth/auth.schema";

export const AccessPlugin = new Elysia({ name: "access.plugin" })
  .use(jwt({
    name: "jwt",
    alg: "RS256",
    schema: TokenSchema,
    exp: env.ACCESS_TTL,
    secret: env.SECRET_KEY,
  }));
