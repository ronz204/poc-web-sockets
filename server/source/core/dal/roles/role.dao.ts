import type { Scope } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Scopes } from "./queries/scopes.query";
import { Update } from "./queries/update.query";

export interface IRoleDao {
  getScopes(args: Scopes.Args): Promise<Scope[]>;
  update(args: Update.Args): Promise<Update.Result>;
};

export class RoleDao implements IRoleDao {
  constructor(private readonly prisma: PrismaClient) { };

  public async getScopes(args: Scopes.Args): Promise<Scope[]> {
    return await this.prisma.scope.findMany(Scopes.query(args));
  };

  public async update(args: Update.Args): Promise<Update.Result> {
    return await this.prisma.role.update(Update.query(args));
  };
};
