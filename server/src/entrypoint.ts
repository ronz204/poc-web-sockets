import { Elysia } from "elysia";
import { Bootstrap } from "./bootstrap";

const app = new Elysia()
  .use(Bootstrap)
  .listen(3000);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
