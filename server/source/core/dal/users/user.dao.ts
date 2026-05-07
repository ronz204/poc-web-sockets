import type { IUserDao } from "./user.idao";
import { PrismaClient } from "@prisma/client";

import { Create } from "./queries/create.query";
import { Update } from "./queries/update.query";
import { Obtain } from "./queries/obtain.query";

export class UserDao implements IUserDao {
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
