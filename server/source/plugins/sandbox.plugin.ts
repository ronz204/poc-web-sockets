import { Elysia } from "elysia";
import { AccessDriver } from "@security/access/access.driver";

export const SandboxPlugin = new Elysia({ name: "sandbox.plugin" })
  .use(AccessDriver)
  .get("/sandbox", ({ status }) => {
    return status(200, "Sandbox is working!");
  }, {
    isAuth: ["system:admin"],
  });
