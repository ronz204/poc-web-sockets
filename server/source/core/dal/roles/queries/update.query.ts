import type { RoleGetPayload } from "@prisma/models";
import type { RoleUpdateArgs } from "@prisma/models";

export namespace Update {
  export interface Args {
    roleId: number;
    name?: string;
    scopeIds?: number[];
  };

  export function query(args: Args) {
    return {
      where: { id: args.roleId },
      data: {
        name: args.name,
        scopes: { set: args.scopeIds?.map((id) => ({ id })) },
      },
      include: { scopes: true },
    } satisfies RoleUpdateArgs;
  };

  export type Result = RoleGetPayload<ReturnType<typeof query>>;
};
