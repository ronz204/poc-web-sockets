import type { RedisClient } from "bun";

export interface ILimitCache {

};

export class LimitCache implements ILimitCache {
  constructor(private readonly redis: RedisClient) {};
};
