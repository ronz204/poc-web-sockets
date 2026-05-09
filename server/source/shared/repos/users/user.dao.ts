import { PrismaClient } from "@prisma/client";
import { Create } from "./queries/create.query";
import { Update } from "./queries/update.query";
import { Obtain } from "./queries/obtain.query";

export interface IUsersDao {
  create(args: Create.Args): Promise<Create.Result>;
  update(args: Update.Args): Promise<Update.Result>;
  obtain(args: Obtain.Args): Promise<Obtain.Result | null>;
};

export class UsersDao implements IUsersDao {
  public constructor(private readonly prisma: PrismaClient) { };

  public async create(args: Create.Args): Promise<Create.Result> {
    return await this.prisma.user.create(Create.query(args));
  };

  public async update(args: Update.Args): Promise<Update.Result> {
    return await this.prisma.user.update(Update.query(args));
  };

  public async obtain(args: Obtain.Args): Promise<Obtain.Result | null> {
    return await this.prisma.user.findUnique(Obtain.query(args));
  };
};
