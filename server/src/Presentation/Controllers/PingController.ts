import Elysia from "elysia";

export const PingController = new Elysia({ prefix: "/ping", name: "ping-controller" })
  .get("/", () => {
    return { message: "pong" };
  });
