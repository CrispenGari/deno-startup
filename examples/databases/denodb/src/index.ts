import { Application } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { db } from "./db/index.ts";
import { Todo, User } from "./models/index.ts";
import { todoRouter, authRouter } from "./routes/index.ts";

(async () => {
  await db.link([User, Todo]);
  // await db.sync({ drop: false });

  const app = new Application();
  app.addEventListener("listen", ({ port, hostname }) =>
    console.log(`The server is running on: http://${hostname}:${port}/`)
  );
  app.use(authRouter.routes());
  app.use(todoRouter.routes());
  await app.listen({ port: 3001, hostname: "127.0.0.1" });
})();
