import { Elysia } from "elysia";
import { PingRouter } from "@Routers/PingRouter";

const app = new Elysia();

app.use(PingRouter);
app.listen(3000);

const url = `http://${app.server?.hostname}:${app.server?.port}`;
console.log(`🦊 Elysia is running at ${url}`);
