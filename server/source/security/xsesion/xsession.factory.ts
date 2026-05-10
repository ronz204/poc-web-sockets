import { env } from "@env";
import type { AgentInfo } from "./xsession.schema";

interface Args {
  userId: number;
  agent: AgentInfo;
  expiresAt?: Date;
};

export abstract class XSessionFactory {
  public static build(args: Args) {
    return {
      ...args.agent,
      userId: args.userId,
      hash: crypto.randomUUID(),
      expiresAt: args.expiresAt ?? new Date(Date.now() + env.REFRESH_TTL),
    };
  };
};
