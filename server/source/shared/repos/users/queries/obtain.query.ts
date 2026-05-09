import type { UserGetPayload } from "@prisma/models";
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
      include: { roles: true },
    } satisfies UserFindUniqueArgs;
  };

  export type Result = UserGetPayload<ReturnType<typeof query>>;
};
