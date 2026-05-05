import type { UserDeleteArgs } from "@prisma/models";

export namespace Delete {
  export interface Args {
    userId: number;
  };

  export function query(args: Args) {
    return {
      where: { id: args.userId }
    } satisfies UserDeleteArgs;
  };
};
