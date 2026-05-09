import type { IRolesCache } from "@cache/roles.cache";
import type { IRolesDao } from "@repos/roles/roles.dao";
import type { TokenClaims } from "@plugins/token.plugin";

export class ScopesHandler {
  constructor(
    private readonly rolesDao: IRolesDao,
    private readonly rolesCache: IRolesCache) {};

  public async handle(claims: TokenClaims): Promise<Set<string>> {
    const rolesPromises = claims.roles.map(async (role) => {
      let roleScopes = await this.rolesCache.get(role);

      if (!roleScopes) {
        const rows = await this.rolesDao.getScopes({ role });
        roleScopes = rows.map(s => s.name);
        await this.rolesCache.set(role, roleScopes);
      };

      return roleScopes;
    });

    const allRoleScopes = await Promise.all(rolesPromises);
    return new Set<string>(allRoleScopes.flat());
  };
};
