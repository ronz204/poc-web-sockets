import { Elysia } from "elysia";
import { UAParser } from "ua-parser-js";

export const XSessionPlugin = new Elysia({ name: "xsession.plugin" })
  .resolve({ as: "global" }, ({ request, server }) => {
    const agent = request.headers.get("user-agent") ?? "";
    const address = server?.requestIP(request)?.address ?? "";

    const { device, os } = new UAParser(agent).getResult();
    const parsed = [device.vendor, device.model]
      .filter(Boolean).join(" ") || os.name || "unknown";

    return { agent: { address, agent, device: parsed } };
  });
