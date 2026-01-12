import { transports } from "winston";
import { Formatters } from "./Formatters";

export const Transports = {
  console: new transports.Console({
    format: Formatters.console,
  }),
};
