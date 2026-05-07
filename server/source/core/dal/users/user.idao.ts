import { Create } from "./queries/create.query";
import { Update } from "./queries/update.query";
import { Obtain } from "./queries/obtain.query";

export interface IUserDao {
  create(args: Create.Args): Promise<Create.Result>;
  update(args: Update.Args): Promise<Update.Result>;
  obtain(args: Obtain.Args): Promise<Obtain.Result | null>;
};
