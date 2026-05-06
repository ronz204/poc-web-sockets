import { env } from "@env";
import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { AccessClaims } from "./access.schema";

export const AccessPlugin = new Elysia({ name: "access.plugin" })
  .use(jwt({
    name: "jwt",
    schema: AccessClaims,
    exp: env.ACCESS_TTL,
    secret: env.SECRET_KEY,
  }));
