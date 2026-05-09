import { Elysia } from "elysia";
import { PrismaPlugin } from "@database/prisma.plugin";
import { AccessDriver } from "@security/access/access.driver";

import { AuthSignInBody } from "./auth-signin.schema";
import { AuthSignInHandler } from "./auth-signin.handler";
import { AccessResponse } from "@security/access/access.schema";

const name: string = "auth-signin.driver";

export const AuthSignInDriver = new Elysia({ name })
  .use(PrismaPlugin)
  .use(AccessDriver)
  
  .derive(({ usersDao }) => ({
    handler: new AuthSignInHandler(usersDao),
  }))
  
  .post("/signin", async ({ status, body, jwt, handler }) => {
    const response = await handler.handle({ body });
    const token = await jwt.sign(response.claims);

    return status(200, { type: "Bearer", token });
  }, {
    body: AuthSignInBody,
    response: AccessResponse,
  });
