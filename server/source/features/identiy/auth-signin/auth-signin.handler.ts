import type { Handler } from "@bases/handler.base";
import type { IUsersDao } from "@repos/users/user.dao";
import type { Request, Response } from "./auth-signin.schema";
import type { ISessionDao } from "@repos/session/sessions.dao";

import { XSessionFactory } from "@security/xsesion/xsession.factory";

export class AuthSignInHandler implements Handler<Request, Response> {
  constructor(
    private readonly usersDao: IUsersDao,
    private readonly sessionDao: ISessionDao) { };

  public async handle(req: Request): Promise<Response> {
    const user = await this.usersDao.obtain(req.body);
    if (!user) throw new Error("User not found");

    const isValid = await this.verify(req.body.password, user.password);
    if (!isValid) throw new Error("Invalid credentials, wrong password");

    const session = XSessionFactory.build({
      userId: user.id, agent: req.agent
    });

    await this.sessionDao.create(session);

    return {
      claims: {
        user: user.id,
        roles: user.roles.map(role => role.name),
      },
    };
  };

  private async verify(psswd: string, hash: string) {
    return await Bun.password.verify(psswd, hash);
  };
};
