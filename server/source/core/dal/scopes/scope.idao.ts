import type { Scope } from "@prisma/client";
import { GetByRole } from "./queries/get-by-role.query";

export interface IScopeDao {
  getByRole(args: GetByRole.Args): Promise<Scope[]>;
};
