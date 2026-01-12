import { format } from "winston";

export const Formatters = {
  console: format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  }),
};
