import { env } from "@env";
import { jwt } from "@elysiajs/jwt";
import { Elysia, t, type Static } from "elysia";

export const TokenClaims = t.Object({
  user: t.Number({ minimum: 1 }),
  roles: t.Array(t.String()),
});

export const TokenPlugin = new Elysia({ name: "token.plugin" })
  .use(jwt({
    name: "jwt",
    schema: TokenClaims,
    exp: env.ACCESS_TTL,
    secret: env.SECRET_KEY,
  }));

export type TokenClaims = Static<typeof TokenClaims>;
