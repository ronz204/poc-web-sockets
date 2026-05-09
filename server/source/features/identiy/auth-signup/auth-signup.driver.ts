import { Elysia } from "elysia";
import { PrismaPlugin } from "@database/prisma.plugin";
import { AccessPlugin } from "@auth/access/access.plugin";

import { AuthSignUpBody } from "./auth-signup.schema";
import { AuthSignUpHandler } from "./auth-signup.handler";
import { AccessResponse } from "@auth/access/access.schema";

const name: string = "auth-signup.plugin";

export const AuthSignUpDriver = new Elysia({ name })
  .use(PrismaPlugin)
  .use(AccessPlugin)

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
