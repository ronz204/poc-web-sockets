import type { AuthPayload } from "./auth.schema";
import type { UserGetPayload } from "@prisma/models";

type Data = UserGetPayload<{ include: { roles: true } }>;

export abstract class AuthMapper {
  public static toResponse(data: Data): AuthPayload {
    return {
      claims: {
        userId: data.id,
        roles: data.roles.map(role => role.name),
      },
    };
  };
};
