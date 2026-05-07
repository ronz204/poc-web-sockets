import { t, type Static } from "elysia";

export const AccessClaims = t.Object({
  user: t.Number({ minimum: 1 }),
  roles: t.Array(t.String({ minLength: 1 }), { minItems: 1 }),
});

export const AccessPayload = t.Object({
  claims: AccessClaims,
});

export const AccessHeaders = t.Object({
  authorization: t.Optional(t.String()),
});

export const AccessResponse = t.Object({
  type: t.Literal("Bearer"),
  token: t.String({ minLength: 1 }),
});

export type AccessClaims = Static<typeof AccessClaims>;
export type AccessPayload = Static<typeof AccessPayload>;
export type AccessResponse = Static<typeof AccessResponse>;
