import { Elysia, status } from "elysia";
import { TokenPlugin } from "@plugins/token.plugin";
import { PrismaPlugin } from "@database/prisma.plugin";

import { AuthSignUpBody } from "./auth-signup.schema";
import { AuthSignUpHandler } from "./auth-signup.handler";
import { AccessResponse } from "@security/testing/access.schema";

const name: string = "auth-signup.driver";

export const AuthSignUpDriver = new Elysia({ name })
  .use(PrismaPlugin)
  .use(TokenPlugin)

  .derive(({ usersDao }) => ({
    handler: new AuthSignUpHandler(usersDao),
  }))

  .post("/signup", async ({ body, jwt, handler }) => {
    const response = await handler.handle({ body });
    const token = await jwt.sign(response.claims);

    return status(200, { type: "Bearer", token });
  }, {
    body: AuthSignUpBody,
    response: AccessResponse,
  });
