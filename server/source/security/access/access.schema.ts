import { t, type Static } from "elysia";
import { TokenClaims } from "@plugins/token.plugin";

export const AccessPayload = t.Object({
  claims: TokenClaims,
});

export const AccessHeaders = t.Object({
  authorization: t.Optional(t.String()),
});

export const AccessResponse = t.Object({
  type: t.Literal("Bearer"),
  token: t.String({ minLength: 1 }),
});

export type AccessPayload = Static<typeof AccessPayload>;
export type AccessResponse = Static<typeof AccessResponse>;
