import { Elysia } from "elysia";
import { PrismaPlugin } from "@database/prisma.plugin";
import { AccessPlugin } from "@auth/access/access.plugin";

import { AuthResponse } from "@auth/auth.schema";
import { AuthSignInBody } from "./auth-signin.schema";
import { AuthSignInHandler } from "./auth-signin.handler";

const name: string = "auth-signin.plugin";

export const AuthSignInDriver = new Elysia({ name })
  .use(PrismaPlugin)
  .use(AccessPlugin)
  
  .derive(({ userDao }) => ({
    handler: new AuthSignInHandler(userDao),
  }))
  
  .post("/signin", async ({ status, body, jwt, handler }) => {
    const response = await handler.handle({ body });
    const token = await jwt.sign(response.claims);

    return status(200, { type: "Bearer", token });
  }, {
    body: AuthSignInBody,
    response: AuthResponse,
  });
