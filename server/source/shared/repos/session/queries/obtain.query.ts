import type { SessionFindUniqueArgs } from "@prisma/models";
import type { SessionGetPayload } from "@prisma/models";

export namespace Obtain {
  export interface Args {
    hash: string;
  };

  export function query(args: Args) {
    return {
      where: { hash: args.hash },
      include: { user: true },
    } satisfies SessionFindUniqueArgs;
  };

  export type Result = SessionGetPayload<ReturnType<typeof query>>;
};
