import { t, type Static } from "elysia";
import { AccessPayload } from "@auth/access/access.schema";

export const AuthSignInBody = t.Object({
  email: t.String({ format: "email", maxLength: 255 }),
  password: t.String({ minLength: 8, maxLength: 64 }),
});

export const AuthSignInRequest = t.Object({
  body: AuthSignInBody,
});

export type Response = Static<typeof AccessPayload>;
export type Request = Static<typeof AuthSignInRequest>;
