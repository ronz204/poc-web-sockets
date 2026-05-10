import { env } from "@env";
import { Elysia } from "elysia";
import { RedisClient } from "bun";

import { RolesCache } from "@cache/roles.cache";

export const RedisPlugin = new Elysia({ name: "redis.plugin" })
  .decorate(() => {
    const redis = new RedisClient(env.REDIS_URL);

    return {
      rolesCache: new RolesCache(redis),
    };
  });
