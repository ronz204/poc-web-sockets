import { Router } from "express";
import { AuthRouter } from "./AuthRouter";

export const ApiRouting = Router();
ApiRouting.use("/auth", AuthRouter);
