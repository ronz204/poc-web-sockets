import { t, type Static } from "elysia";

export const AgentSchema = t.Object({
  address: t.String(),
  agent: t.String(),
  device: t.String(),
});

export type AgentInfo = Static<typeof AgentSchema>;
