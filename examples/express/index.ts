// @deno-types="npm:@types/express@4.17.15"
import express, { Application } from "npm:express@4.18.2";
import { router } from "./routes/index.ts";
const app: Application = express();
const PORT = 3001;

app.use(router);
app.listen(PORT, () =>
  console.log("the server is running on http://localhost:3001")
);
