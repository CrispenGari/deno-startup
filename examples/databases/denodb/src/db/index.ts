import {
  Database,
  PostgresConnector,
} from "https://deno.land/x/denodb@v1.3.0/mod.ts";

const connector = new PostgresConnector({
  database: "todo",
  host: "localhost",
  username: "postgres",
  password: "root",
  port: 5432,
});

export const db = new Database(connector, { debug: true });
