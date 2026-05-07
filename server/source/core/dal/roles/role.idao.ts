import type { Scope } from "@prisma/client";
import type { Scopes } from "./queries/scopes.query";

export interface IRoleDao {
  getScopes(args: Scopes.Args): Promise<Scope[]>;
};
