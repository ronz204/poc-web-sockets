import type { SessionCreateArgs } from "@prisma/models";

export namespace Create {
  export interface Args {
    userId: number;
    hash: string;
    agent: string;
    device: string;
    address: string;
    expiresAt: Date;
  };

  export function query(args: Args) {
    return {
      data: {
        userId: args.userId,
        hash: args.hash,
        agent: args.agent,
        device: args.device,
        address: args.address,
        expiresAt: args.expiresAt,
      },
    } satisfies SessionCreateArgs;
  };
};
