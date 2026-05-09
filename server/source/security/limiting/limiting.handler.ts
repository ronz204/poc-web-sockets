import type { Handler } from "@bases/handler.base";
import type { ILimitingCache } from "./limiting.cache";
import type { RateLimitConfig, RateLimitResult } from "./limiting.schema";

export interface RateLimitRequest {
  ip:     string;
  userId: number | undefined;
  config: RateLimitConfig;
};

export class RateLimitHandler implements Handler<RateLimitRequest, RateLimitResult> {
  constructor(private readonly cache: ILimitingCache) {};

  public async handle(req: RateLimitRequest): Promise<RateLimitResult> {
    const { ip, userId, config } = req;
    const { max, window } = config;

    const nowSecs     = Date.now() / 1000;
    const windowStart = Math.floor(nowSecs / window) * window;
    const prevStart   = windowStart - window;
    const elapsed     = nowSecs - windowStart;

    const identifier = userId ? `${ip}:${userId}` : ip;
    const currKey    = `rl:${identifier}:${windowStart}`;
    const prevKey    = `rl:${identifier}:${prevStart}`;

    const [allowed, estimated, resetIn] = await this.cache.evaluate({
      currKey,
      prevKey,
      limit: max,
      window,
      elapsed,
    });

    return {
      allowed:   allowed === 1,
      estimated,
      remaining: Math.max(0, max - estimated),
      resetIn,
    };
  };
};
