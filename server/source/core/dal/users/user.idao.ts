import { Create } from "./queries/create.query";
import { Delete } from "./queries/delete.query";

export interface IUserDao {
  create(args: Create.Args): Promise<void>;
  delete(args: Delete.Args): Promise<void>;
};
