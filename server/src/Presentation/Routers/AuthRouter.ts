import { Router } from "express";
import { AuthController } from "@Controllers/AuthController";

const controller = new AuthController();
export const AuthRouter = Router();

AuthRouter.get("/ping", controller.ping);
AuthRouter.post("/login", controller.login);
AuthRouter.post("/register", controller.register);
