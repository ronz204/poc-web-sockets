import type { IUserDao } from "@dal/users/user.idao";
import type { Request, Response } from "./auth-signup.schema";

export class AuthSignUpHandler {
  constructor(private readonly userDao: IUserDao) { };

  public async handle(req: Request): Promise<Response> {
    const exists = await this.userDao.obtain(req.body);
    if (exists) throw new Error("User already exists");

    req.body.password = await this.hash(req.body.password);
    const created = await this.userDao.create(req.body);

    return { userId: created.id };
  };

  private async hash(password: string) {
    return await Bun.password.hash(password);
  };
};
