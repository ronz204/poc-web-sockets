import { Elysia, status } from "elysia";
import { TokenPlugin } from "@plugins/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";

import { AuthSignUpBody } from "./auth-signup.schema";
import { AuthSignUpHandler } from "./auth-signup.handler";

import { AccessResponse } from "@security/access/access.schema";
import { XSessionPlugin } from "@security/xsesion/xsession.plugin";

const name: string = "auth-signup.driver";

export const AuthSignUpDriver = new Elysia({ name })
  .use(XSessionPlugin)
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ usersDao, sessionDao }) => ({
    handler: new AuthSignUpHandler(usersDao, sessionDao),
  }))

  .post("/signup", async ({ body, jwt, agent, handler }) => {
    const response = await handler.handle({ body, agent });
    const token = await jwt.sign(response.claims);

    return status(200, { type: "Bearer", token });
  }, {
    withAgent: true,
    body: AuthSignUpBody,
    response: AccessResponse,
  });
