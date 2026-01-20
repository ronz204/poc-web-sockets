import { Elysia, type ElysiaConfig } from "elysia";

const config: ElysiaConfig<""> = {
  name: "sockets-router"
};

export const SocketRouter = new Elysia(config)
  .ws("/ws", {
    open: (ctx) => {
      console.log("WebSocket connection opened", ctx);
      ctx.send("Welcome to the WebSocket server!");
    },

    message: (ctx, msg) => {
      console.log("Received message:", msg);
      ctx.send(`Echo: ${msg}`);
    },

    close: (ctx) => {
      console.log("WebSocket connection closed", ctx);
    }
  });
