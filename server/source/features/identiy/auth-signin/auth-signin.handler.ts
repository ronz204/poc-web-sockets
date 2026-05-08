import type { IUserDao } from "@dal/users/user.dao";
import type { Handler } from "@interfaces/handler.inter";
import type { Request, Response } from "./auth-signin.schema";

import { AccessMapper } from "@auth/access/access.mapper";

export class AuthSignInHandler implements Handler<Request, Response> {
  constructor(private readonly userDao: IUserDao) { };

  public async handle(req: Request): Promise<Response> {
    const user = await this.userDao.obtain(req.body);
    if (!user) throw new Error("User not found");

    const isValid = await this.verify(req.body.password, user.password);
    if (!isValid) throw new Error("Invalid credentials, wrong password");
    return AccessMapper.toResponse(user);
  };

  private async verify(psswd: string, hash: string) {
    return await Bun.password.verify(psswd, hash);
  };
};
