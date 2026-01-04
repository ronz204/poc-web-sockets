import type { Request, Response } from "express";

export class AuthController {
  constructor() {
    this.ping = this.ping.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  };

  public async ping(req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: "pong" });
  };

  public async login(req: Request, res: Response): Promise<void> {
    res.status(200).json({ message: "Login successful" });
  };

  public async register(req: Request, res: Response): Promise<void> {
    res.status(201).json({ message: "Registration successful" });
  };
};
