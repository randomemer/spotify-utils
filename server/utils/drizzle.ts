import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "../database/schema";
import { createConnection } from "mysql2/promise";
import { RuntimeConfig } from "nuxt/schema";

export const tables = schema;

export async function useDrizzle(config: RuntimeConfig) {
  const client = await createConnection({ uri: config.dbUrl });
  return drizzle(client, { schema, mode: "planetscale", logger: true });
}
