import type { ScopeFindManyArgs } from "@prisma/models";

export namespace Scopes {
  export interface Args {
    role: string;
  };

  export function query(args: Args) {
    return {
      where: { roles: { some: { name: args.role } } },
    } satisfies ScopeFindManyArgs;
  };
};
