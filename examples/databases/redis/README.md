### redis

In this example we are going to create a simple api that stores data in the `redis` database. We are going to use the [express](/examples/express/README.md) example as reference to this one.

First we are going to create a file called `client/index.ts` and add the following code in it:

```ts
import { createClient } from "npm:redis@^4.5";

export const client = createClient({
  url: "redis://localhost:6379",
});
```

> Just makesure that you have a `redis` instance running on your computer.

In the `index.ts` we are going to have the following code to it, which allows us to connect to the redis server on our computer:

```ts
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
```

In our `routes/index.ts` file we are going to add the following code in it:

```ts
import { Router, Request, Response } from "npm:express@4.18.2";
import { client } from "../client/index.ts";

export const router = Router();

router.get("/:key", async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    const value = await client.get(key);
    return res.status(200).json({
      value,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/:key", async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    await client.del(key);
    return res.status(200).json({
      deleted: true,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/:key", async (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    const key = req.params.key;
    await client.set(key, JSON.stringify(value));
    return res.status(200).json({
      stored: value,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
```

With only this we will be able to store `key-value` pair data in our `redis` database.
