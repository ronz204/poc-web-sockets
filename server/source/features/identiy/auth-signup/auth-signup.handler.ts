import type { Handler } from "@bases/handler.base";
import type { IUsersDao } from "@repos/users/user.dao";
import type { Request, Response } from "./auth-signup.schema";
import type { ISessionDao } from "@repos/session/sessions.dao";

import { XSessionFactory } from "@security/xsesion/xsession.factory";

export class AuthSignUpHandler implements Handler<Request, Response> {
  constructor(
    private readonly usersDao: IUsersDao,
    private readonly sessionDao: ISessionDao) {};

  public async handle(req: Request): Promise<Response> {
    const exists = await this.usersDao.obtain(req.body);
    if (exists) throw new Error("User already exists");

    req.body.password = await this.hash(req.body.password);
    const created = await this.usersDao.create(req.body);

    const session = XSessionFactory.build({
      userId: created.id, agent: req.agent });
    await this.sessionDao.create(session);

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
