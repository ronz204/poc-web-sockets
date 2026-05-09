import { Elysia, status } from "elysia";

import { RedisPlugin } from "@database/redis.plugin";
import { AccessDriver } from "@security/access/access.driver";
import { LimitingCache } from "./limiting.cache";
import { RateLimitHandler } from "./limiting.handler";
import type { RateLimitConfig } from "./limiting.schema";

const DEFAULT_CONFIG: RateLimitConfig = { max: 100, window: 60 };

export const LimitingPlugin = new Elysia({ name: "limiting.plugin" })
  .use(RedisPlugin)

  .decorate(({ redis }) => ({
    limiter: new RateLimitHandler(new LimitingCache(redis)),
  }))

  .use(AccessDriver)

  .macro({
    isLimited: (config: RateLimitConfig = DEFAULT_CONFIG) => ({
      resolve: async ({ request, set, limiter, claims }) => {
        const forwarded = request.headers.get("x-forwarded-for");
        const ip        = forwarded?.split(",")[0].trim() ?? "unknown";
        const userId    = claims?.user;

        const result = await limiter.handle({ ip, userId, config });

        set.headers["X-RateLimit-Limit"]     = String(config.max);
        set.headers["X-RateLimit-Remaining"] = String(result.remaining);
        set.headers["X-RateLimit-Reset"]     = String(Math.ceil(Date.now() / 1000) + result.resetIn);

        if (!result.allowed) {
          set.headers["Retry-After"] = String(result.resetIn);
          return status(429, "Too Many Requests");
        };
      },
    }),
  });
