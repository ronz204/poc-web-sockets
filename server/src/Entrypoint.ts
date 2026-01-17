import { Elysia } from "elysia";

const app = new Elysia();

app.get("/", () => {
  return { message: "Hello, Elysia!" };
});

app.listen(3000);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
