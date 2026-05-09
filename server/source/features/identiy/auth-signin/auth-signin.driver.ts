import { Elysia, status } from "elysia";
import { TokenPlugin } from "@plugins/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";

import { AuthSignInBody } from "./auth-signin.schema";
import { AuthSignInHandler } from "./auth-signin.handler";
import { AccessResponse } from "@security/testing/access.schema";

const name: string = "auth-signin.driver";

export const AuthSignInDriver = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)
  
  .derive(({ usersDao }) => ({
    handler: new AuthSignInHandler(usersDao),
  }))
  
  .post("/signin", async ({ body, jwt, handler }) => {
    const response = await handler.handle({ body });
    const token = await jwt.sign(response.claims);

    return status(200, { type: "Bearer", token });
  }, {
    body: AuthSignInBody,
    response: AccessResponse,
  });
