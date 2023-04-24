// @deno-types="npm:@types/express@4.17.15"
import express, { Application } from "npm:express@4.18.2";
import { router } from "./routes/index.ts";
import { client } from "./client/index.ts";
const app: Application = express();
const PORT = 3001;

(async () => {
  await client.connect();
  app.use(express.json());
  app.use(router);
  app.listen(PORT, () =>
    console.log("the server is running on http://localhost:3001")
  );
})().catch((error) => {
  console.log(error.message);
});
