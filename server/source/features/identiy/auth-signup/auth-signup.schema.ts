import { t, type Static } from "elysia";
import { AuthPayload } from "@auth/auth.schema";

export const AuthSignUpBody = t.Object({
  name: t.String({ minLength: 4, maxLength: 20 }),
  email: t.String({ format: "email", maxLength: 255 }),
  password: t.String({ minLength: 8, maxLength: 64 }),
});

export const AuthSignUpRequest = t.Object({
  body: AuthSignUpBody,
});

export type Response = Static<typeof AuthPayload>;
export type Request = Static<typeof AuthSignUpRequest>;
