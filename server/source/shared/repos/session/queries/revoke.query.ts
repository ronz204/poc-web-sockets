import type { SessionUpdateArgs } from "@prisma/models";

export namespace Revoke {
  export interface Args {
    hash: string;
  };

  export function query(args: Args) {
    return {
      where: { hash: args.hash },
      data: { revokedAt: new Date() },
    } satisfies SessionUpdateArgs;
  };
};
