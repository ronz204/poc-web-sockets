import { Create } from "./queries/create.query";
import { Delete } from "./queries/delete.query";
import { Update } from "./queries/update.query";

export interface IUserDao {
  create(args: Create.Args): Promise<void>;
  delete(args: Delete.Args): Promise<void>;
  update(args: Update.Args): Promise<void>;
};
