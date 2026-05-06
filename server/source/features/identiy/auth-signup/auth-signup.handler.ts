import type { IUserDao } from "@dal/users/user.idao";
import type { Handler } from "@interfaces/handler.inter";
import type { Request, Response } from "./auth-signup.schema";

import { AuthMapper } from "@auth/auth.mapper";

export class AuthSignUpHandler implements Handler<Request, Response> {
  constructor(private readonly userDao: IUserDao) { };

  public async handle(req: Request): Promise<Response> {
    const exists = await this.userDao.obtain(req.body);
    if (exists) throw new Error("User already exists");

    req.body.password = await this.hash(req.body.password);
    const created = await this.userDao.create(req.body);
    return AuthMapper.toResponse(created);
  };

  private async hash(password: string) {
    return await Bun.password.hash(password);
  };
};
