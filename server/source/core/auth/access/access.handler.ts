import type { AccessClaims } from "./access.schema";
import type { IRoleDao } from "@dal/roles/role.dao";
import type { IRolesCache } from "@cache/roles.cache";

export class AccessHandler {
  constructor(
    private readonly roleDao: IRoleDao,
    private readonly rolesCache: IRolesCache) { };

  public async handle(claims: AccessClaims): Promise<Set<string>> {
    const rolesPromises = claims.roles.map(async (role) => {
      let roleScopes = await this.rolesCache.get(role);

      if (!roleScopes) {
        const rows = await this.roleDao.getScopes({ role });
        roleScopes = rows.map(s => s.name);
        await this.rolesCache.set(role, roleScopes);
      };

      return roleScopes;
    });

    const allRoleScopes = await Promise.all(rolesPromises);
    return new Set<string>(allRoleScopes.flat());
  };
};
