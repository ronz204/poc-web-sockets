import { Create } from "./queries/create.query";

export interface IUserDao {
  create(args: Create.Args): Promise<void>;
};
