import "dotenv/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/mysql2";

async function main() {
  const connection = await mysql.createConnection(process.env.DB_URL!!);
  const db = drizzle(connection, { schema, mode: "default" });

  await migrate(db, { migrationsFolder: "server/database/migrations" });
  await connection.end();
}

main();
