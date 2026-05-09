import type { RedisClient } from "bun";

// Atomic Lua script — executed as a single Redis command.
// Reads both window counters, computes the sliding estimate,
// and either increments or rejects — no TOCTOU race condition.
const SLIDING_WINDOW_SCRIPT = `
local curr    = tonumber(redis.call('GET', KEYS[1])) or 0
local prev    = tonumber(redis.call('GET', KEYS[2])) or 0
local limit   = tonumber(ARGV[1])
local window  = tonumber(ARGV[2])
local elapsed = tonumber(ARGV[3])

local weight    = 1 - (elapsed / window)
local estimated = math.floor(prev * weight) + curr

if estimated >= limit then
  local ttl = redis.call('TTL', KEYS[1])
  return {0, estimated, ttl < 0 and window or ttl}
end

local new_count = redis.call('INCR', KEYS[1])
if new_count == 1 then
  redis.call('EXPIRE', KEYS[1], window * 2)
end

return {1, estimated + 1, window - math.floor(elapsed)}
`;

export interface EvaluateArgs {
  currKey: string;
  prevKey: string;
  limit:   number;
  window:  number;
  elapsed: number;
};

export interface ILimitingCache {
  evaluate(args: EvaluateArgs): Promise<[allowed: number, estimated: number, resetIn: number]>;
};

export class LimitingCache implements ILimitingCache {
  constructor(private readonly redis: RedisClient) {};

  public async evaluate(args: EvaluateArgs): Promise<[number, number, number]> {
    const result = await this.redis.send("EVAL", [
      SLIDING_WINDOW_SCRIPT,
      "2",
      args.currKey,
      args.prevKey,
      String(args.limit),
      String(args.window),
      String(args.elapsed),
    ]) as [number, number, number];

    return result;
  };
};
