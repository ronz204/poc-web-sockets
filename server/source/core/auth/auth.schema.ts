import { t, type Static } from "elysia";

export const AuthClaims = t.Object({
  userId: t.Number({ minimum: 1 }),
  roles: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
});

export const AuthPayload = t.Object({
  claims: AuthClaims,
});

export const AuthResponse = t.Object({
  type: t.Literal("Bearer"),
  token: t.String({ minLength: 1 }),
});

export type AuthClaims = Static<typeof AuthClaims>;
export type AuthPayload = Static<typeof AuthPayload>;
export type AuthResponse = Static<typeof AuthResponse>;
