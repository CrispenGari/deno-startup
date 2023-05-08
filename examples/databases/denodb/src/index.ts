import {
  Database,
  PostgresConnector,
} from "https://deno.land/x/denodb@v1.3.0/mod.ts";
import "https://deno.land/std@0.177.0/node/events.ts";

const connector = new PostgresConnector({
  database: "todo",
  host: "localhost",
  username: "postgres",
  password: "root",
  port: 5432,
});

export const db = new Database(connector, { debug: true });

// import { Application } from "https://deno.land/x/oak@v12.4.0/mod.ts";
// import { todoRouter } from "./routes/index.ts";
// import { db } from "./db/index.ts";
// import { Todo, User } from "./models/index.ts";

// (async () => {
//   await db.link([User, Todo]);
//   await db.sync({ drop: false });
//   const app = new Application();
//   app.addEventListener("listen", ({ port, hostname }) =>
//     console.log(`The server is running on: http://${hostname}:${port}/`)
//   );
//   app.use(todoRouter.routes());
//   await app.listen({ port: 3001, hostname: "127.0.0.1" });
// })();
