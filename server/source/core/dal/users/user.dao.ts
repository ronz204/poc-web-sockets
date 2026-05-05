import type { IUserDao } from "./user.idao";
import { PrismaClient } from "@prisma/client";
import { Create } from "./queries/create.query";

export class UserDao implements IUserDao {
  public constructor(private readonly prisma: PrismaClient) {};

  public async create(args: Create.Args): Promise<void> {
    await this.prisma.user.create(Create.query(args));
  };
};
