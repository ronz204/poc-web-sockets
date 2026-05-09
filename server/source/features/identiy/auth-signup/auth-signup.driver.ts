import { Elysia } from "elysia";
import { PrismaPlugin } from "@database/prisma.plugin";
import { AccessDriver } from "@security/access/access.driver";

import { AuthSignUpBody } from "./auth-signup.schema";
import { AuthSignUpHandler } from "./auth-signup.handler";
import { AccessResponse } from "@security/access/access.schema";

const name: string = "auth-signup.driver";

export const AuthSignUpDriver = new Elysia({ name })
  .use(PrismaPlugin)
  .use(AccessDriver)

  .derive(({ usersDao }) => ({
    handler: new AuthSignUpHandler(usersDao),
  }))

  .post("/signup", async ({ status, body, jwt, handler }) => {
    const response = await handler.handle({ body });
    const token = await jwt.sign(response.claims);

    return status(200, { type: "Bearer", token });
  }, {
    body: AuthSignUpBody,
    response: AccessResponse,
  });
