import { t, type Static } from "elysia";

export const RateLimitConfig = t.Object({
  max:    t.Number({ minimum: 1, default: 100 }),
  window: t.Number({ minimum: 1, default: 60 }),  // seconds
});

export const RateLimitResult = t.Object({
  allowed:   t.Boolean(),
  estimated: t.Number(),
  remaining: t.Number(),
  resetIn:   t.Number(),  // seconds until current window resets
});

export type RateLimitConfig = Static<typeof RateLimitConfig>;
export type RateLimitResult = Static<typeof RateLimitResult>;
