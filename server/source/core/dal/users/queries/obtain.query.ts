import type { User } from "@prisma/client";
import type { UserFindUniqueArgs } from "@prisma/models";

export namespace Obtain {
  export interface Args {
    id?: number;
    name?: string;
    email?: string;
  };

  export function query(args: Args) {
    return {
      where: {
        id: args.id,
        name: args.name,
        email: args.email,
      },
    } satisfies UserFindUniqueArgs;
  };

  export type Result = User | null;
};
