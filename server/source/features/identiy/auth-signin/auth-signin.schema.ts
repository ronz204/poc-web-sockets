import { t, type Static } from "elysia";

export const AuthSignInBody = t.Object({
  email: t.String({ format: "email", maxLength: 255 }),
  password: t.String({ minLength: 8, maxLength: 64 }),
});

export const AuthSignInRequest = t.Object({
  body: AuthSignInBody,
});

export const AuthSignInResponse = t.Object({
  userId: t.Number({ minimum: 1 }),
});

export type Request = Static<typeof AuthSignInRequest>;
export type Response = Static<typeof AuthSignInResponse>;
