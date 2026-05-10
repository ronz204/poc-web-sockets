import { PrismaClient } from "@prisma/client";

import { Obtain } from "./queries/obtain.query";
import { Create } from "./queries/create.query";
import { Revoke } from "./queries/revoke.query";

export interface ISessionDao {
  create(args: Create.Args): Promise<void>;
  revoke(args: Revoke.Args): Promise<void>;
  obtain(args: Obtain.Args): Promise<Obtain.Result | null>;
};

export class SessionDao implements ISessionDao {
  constructor(private prisma: PrismaClient) {};

  public async create(args: Create.Args): Promise<void> {
    await this.prisma.session.create(Create.query(args));
  };

  public async revoke(args: Revoke.Args): Promise<void> {
    await this.prisma.session.update(Revoke.query(args));
  };

  public async obtain(args: Obtain.Args): Promise<Obtain.Result | null> {
    return await this.prisma.session.findUnique(Obtain.query(args));
  };
};
