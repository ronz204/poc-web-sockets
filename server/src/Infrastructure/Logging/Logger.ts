import { createLogger } from "winston";
import { Transports } from "./Transports";

export const Logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: [Transports.console],
});
