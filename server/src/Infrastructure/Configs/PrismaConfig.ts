import { Environment } from "./Environment";

export const PrismaConfig = {
  db: Environment.POSTGRES_DB,
  url: Environment.POSTGRES_URL,
};
