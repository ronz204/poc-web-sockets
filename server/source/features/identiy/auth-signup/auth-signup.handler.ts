import type { Handler } from "@bases/handler.base";
import type { IUsersDao } from "@repos/users/user.dao";
import type { Request, Response } from "./auth-signup.schema";

export class AuthSignUpHandler implements Handler<Request, Response> {
  constructor(private readonly usersDao: IUsersDao) {};

  public async handle(req: Request): Promise<Response> {
    const exists = await this.usersDao.obtain(req.body);
    if (exists) throw new Error("User already exists");

    req.body.password = await this.hash(req.body.password);
    const created = await this.usersDao.create(req.body);

    return {
      claims: {
        user: created.id,
        roles: created.roles.map(role => role.name),
      },
    };
  };

  private async hash(password: string) {
    return await Bun.password.hash(password);
  };
};
