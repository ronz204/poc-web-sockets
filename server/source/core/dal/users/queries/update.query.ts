import type { UserUpdateArgs } from "@prisma/models";

export namespace Update {
  export interface Args {
    userId: number;
    name?: string;
    email?: string;
    password?: string;
  };

  export function query(args: Args) {
    return {
      where: { id: args.userId },
      data: {
        name: args.name,
        email: args.email,
        password: args.password,
      },
    } satisfies UserUpdateArgs;
  };
};
