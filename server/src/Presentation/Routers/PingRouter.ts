import Elysia from "elysia";
import { PingController } from "@Controllers/PingController";

export const PingRouter = new Elysia({ prefix: "/ping" });
PingRouter.get("/", () => PingController.ping());
