import { t } from "elysia";

export const TokenSchema = t.Object({
  user: t.Number({ minimum: 1 }),
});

export const AuthPayload = t.Object({
  userId: t.Number({ minimum: 1 }),
});

export const AuthResponse = t.Object({
  type: t.Literal("Bearer"),
  token: t.String({  minLength: 1 }),
});
