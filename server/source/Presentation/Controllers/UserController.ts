import { Elysia, type ElysiaConfig } from "elysia";

const config: ElysiaConfig<"/users"> = {
  prefix: "/users", name: "user-controller"
};

export const UserController = new Elysia(config)
  .get("/ping", () => ({ ping: "pong" }));
