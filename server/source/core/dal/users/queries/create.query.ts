import type { UserGetPayload } from "@prisma/models";
import type { UserCreateArgs } from "@prisma/models";

export namespace Create {
  export interface Args {
    name: string;
    email: string;
    password: string;
  };

  export function query(args: Args) {
    return {
      data: {
        name: args.name,
        email: args.email,
        password: args.password,
        roles: { connect: { name: "USER" } }
      },
      include: { roles: true },
    } satisfies UserCreateArgs;
  };

  export type Result = UserGetPayload<ReturnType<typeof query>>;
};
