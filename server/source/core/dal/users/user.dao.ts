import type { IUserDao } from "./user.idao";
import { PrismaClient } from "@prisma/client";

import { Create } from "./queries/create.query";
import { Delete } from "./queries/delete.query";
import { Update } from "./queries/update.query";

export class UserDao implements IUserDao {
  public constructor(private readonly prisma: PrismaClient) {};

  public async create(args: Create.Args): Promise<void> {
    await this.prisma.user.create(Create.query(args));
  };

  public async delete(args: Delete.Args): Promise<void> {
    await this.prisma.user.delete(Delete.query(args));
  };

  public async update(args: Update.Args): Promise<void> {
    await this.prisma.user.update(Update.query(args));
  };
};
