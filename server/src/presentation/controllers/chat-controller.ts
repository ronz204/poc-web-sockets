import { Elysia, type ElysiaConfig } from "elysia";

const config: ElysiaConfig<"/sockets"> = {
  prefix: "/sockets", name: "chat-controller"
};

export const ChatController = new Elysia(config)
  .get("/health", () => ({ status: "healthy" }))
  .ws("/chat", {
    open: (ctx) => {
      ctx.subscribe("global");
      console.log("WebSocket connection opened", ctx.id);
    },

    message: (ctx, msg) => {
      console.log("Message from:" , ctx.id, "Message:", msg);
      ctx.publish("global", msg);
    },

    close: (ctx) => {
      ctx.unsubscribe("global");
      console.log("WebSocket connection closed", ctx.id);
    },
  });
