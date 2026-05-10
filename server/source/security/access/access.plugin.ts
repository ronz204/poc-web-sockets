import { Elysia, status } from "elysia";
import { AccessHeaders } from "./access.schema";
import { TokenPlugin } from "@plugins/token.plugin";

export const AccessPlugin = new Elysia({ name: "access.plugin" })
  .use(TokenPlugin)
  .guard({ headers: AccessHeaders })
  .resolve({ as: "global" }, async ({ headers, jwt }) => {
    const header = headers["authorization"];

    if (!header?.startsWith("Bearer ")) {
      return status(401, "Unauthorized");
    };

    const claims = await jwt.verify(header.slice(7));
    if (!claims) return status(401, "Unauthorized");

    return { claims };
  });
