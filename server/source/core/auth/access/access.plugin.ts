import { env } from "@env";
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AuthClaims } from "@auth/auth.schema";

export const AccessPlugin = new Elysia({ name: "access.plugin" })
  .use(jwt({
    name: "jwt",
    schema: AuthClaims,
    exp: env.ACCESS_TTL,
    secret: env.SECRET_KEY,
  }));
