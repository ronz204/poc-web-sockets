import { Elysia, status } from "elysia";
import { TokenPlugin } from "@plugins/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";

import { AuthSignInBody } from "./auth-signin.schema";
import { AuthSignInHandler } from "./auth-signin.handler";

import { AccessResponse } from "@security/access/access.schema";
import { XSessionPlugin } from "@security/xsesion/xsession.plugin";

const name: string = "auth-signin.driver";

export const AuthSignInDriver = new Elysia({ name })
  .use(XSessionPlugin)
  .use(PrismaPlugin)
  .use(TokenPlugin)
  
  .derive(({ usersDao, sessionDao }) => ({
    handler: new AuthSignInHandler(usersDao, sessionDao),
  }))
  
  .post("/signin", async ({ body, jwt, agent, handler }) => {
    const response = await handler.handle({ body, agent });
    const token = await jwt.sign(response.claims);

    return status(200, { type: "Bearer", token });
  }, {
    body: AuthSignInBody,
    response: AccessResponse,
  });
