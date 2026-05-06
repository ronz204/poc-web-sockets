import type { User } from "@prisma/client";

import { Create } from "./queries/create.query";
import { Delete } from "./queries/delete.query";
import { Update } from "./queries/update.query";
import { Obtain } from "./queries/obtain.query";

export interface IUserDao {
  delete(args: Delete.Args): Promise<User>;
  create(args: Create.Args): Promise<Create.Result>;
  update(args: Update.Args): Promise<Update.Result>;
  obtain(args: Obtain.Args): Promise<Obtain.Result | null>;
};
