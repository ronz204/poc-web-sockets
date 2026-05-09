import type { RedisClient } from "bun";

export interface IRolesCache {
  get(role: string): Promise<string[] | null>;
  set(role: string, scopes: string[]): Promise<void>;
};

export class RolesCache implements IRolesCache {
  private static readonly TTL = 300; // 5 minutes

  public constructor(private readonly redis: RedisClient) {};

  private key(role: string): string {
    return `role:scopes:${role}`;
  };

  public async get(role: string): Promise<string[] | null> {
    const cached = await this.redis.get(this.key(role));
    if (!cached) return null;
    return JSON.parse(cached);
  };

  public async set(role: string, scopes: string[]): Promise<void> {
    const key = this.key(role);
    await Promise.all([
      this.redis.set(key, JSON.stringify(scopes)),
      this.redis.expire(key, RolesCache.TTL)
    ]);
  };
};
