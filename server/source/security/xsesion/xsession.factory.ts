import { env } from "@env";
import type { AgentInfo } from "./xsession.schema";

interface SessionArgs {
  userId: number;
  agent: AgentInfo;
  expiresAt?: Date;
};

export abstract class XSessionFactory {
  public static build(args: SessionArgs) {
    const { agent, userId, expiresAt } = args;

    return {
      ...agent, userId: userId,
      hash: crypto.randomUUID(),
      expiresAt: expiresAt ?? this.getDefaultExpiry(),
    };
  };

  private static getDefaultExpiry(): Date {
    return new Date(Date.now() + env.REFRESH_TTL);
  };
};
