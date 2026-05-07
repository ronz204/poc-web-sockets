import type { Scope } from "@prisma/client";
import type { IRoleDao } from "./role.idao";
import { PrismaClient } from "@prisma/client";

import { Scopes } from "./queries/scopes.query";

export class RoleDao implements IRoleDao {
  constructor(private readonly prisma: PrismaClient) { };

  public async getScopes(args: Scopes.Args): Promise<Scope[]> {
    return await this.prisma.scope.findMany(Scopes.query(args));
  };
};
