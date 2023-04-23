### express

In this example i will show how we can create an express rest api using `deno`. First we need to create a `deno.json` file and add the following configs in it:

```json
{
  "tasks": {
    "start": "deno run --watch --allow-net --allow-read --allow-env index.ts"
  },
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  }
}
```

Next we are going to create a file called `index.ts` and add the following code in it:

```ts
// @deno-types="npm:@types/express@4.17.15"
import express, { Application } from "npm:express@4.18.2";
import { router } from "./routes/index.ts";
const app: Application = express();
const PORT = 3001;

app.use(router);
app.listen(PORT, () =>
  console.log("the server is running on http://localhost:3001")
);
```

In our module `routes/index.ts` we are going to have the following code in it:

```ts
import { Router, Request, Response } from "npm:express@4.18.2";

export const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ msg: "Welcome to the Dinosaur API!" });
});
```

Now if we run the following command:

```shell
deno task start
```

An visit to `http://localhost:3001/` we will get the following response:

```json
{
  "msg": "Welcome to the Dinosaur API!"
}
```
