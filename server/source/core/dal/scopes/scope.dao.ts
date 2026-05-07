import type { Scope } from "@prisma/client";
import type { IScopeDao } from "./scope.idao";
import { PrismaClient } from "@prisma/client";

import { GetByRole } from "./queries/get-by-role.query";

export class ScopeDao implements IScopeDao {
  public constructor(private readonly prisma: PrismaClient) {};

  public async getByRole(args: GetByRole.Args): Promise<Scope[]> {
    return await this.prisma.scope.findMany(GetByRole.query(args));
  };
};
