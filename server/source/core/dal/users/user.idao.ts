import type { User } from "@prisma/client";

import { Create } from "./queries/create.query";
import { Delete } from "./queries/delete.query";
import { Update } from "./queries/update.query";
import { Obtain } from "./queries/obtain.query";

export interface IUserDao {
  create(args: Create.Args): Promise<User>;
  delete(args: Delete.Args): Promise<User>;
  update(args: Update.Args): Promise<User>;
  obtain(args: Obtain.Args): Promise<Obtain.Result>;
};
