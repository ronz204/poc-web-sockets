import { Elysia } from "elysia";
import { PrismaPlugin } from "@database/prisma.plugin";
import { AccessPlugin } from "@auth/access/access.plugin";

import { AuthSignInBody } from "./auth-signin.schema";
import { AuthSignInHandler } from "./auth-signin.handler";
import { AccessResponse } from "@auth/access/access.schema";

const name: string = "auth-signin.plugin";

export const AuthSignInDriver = new Elysia({ name })
  .use(PrismaPlugin)
  .use(AccessPlugin)
  
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
