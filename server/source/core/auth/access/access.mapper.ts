import type { AccessPayload } from "./access.schema";
import type { UserGetPayload } from "@prisma/models";

type Data = UserGetPayload<{ include: { roles: true } }>;

export abstract class AccessMapper {
  public static toResponse(data: Data): AccessPayload {
    return {
      claims: {
        user: data.id,
        roles: data.roles.map(role => role.name),
      },
    };
  };
};
