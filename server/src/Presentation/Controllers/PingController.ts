import Elysia from "elysia";

export const PingController = new Elysia({ prefix: "/ping" })
  .get("/", () => {
    return { message: "pong" };
  });
