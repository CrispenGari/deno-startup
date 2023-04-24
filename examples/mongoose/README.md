### mongoose

In this example we are going to use the `mongoose` together with deno to create a basic express application that will allow us to create and query todos in a mongodb database. We are going to use the [express](/examples/express/README.md) example as reference to this one.

We are going to create a `schema` in the `schema/index.ts` file and add the following code into it.

```ts
import { model, Schema } from "npm:mongoose@^6.7";

const ToSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// valiations
ToSchema.path("title").required(true, "todo title cannot be blank.");

export const Todo = model("todo", ToSchema);
```

Here we are just creating a todo schema and export it so that we will use it in our routes to create, and query todos. In our `routes/index.ts` file we are going to add the following code in it:

```ts
import { Router, Request, Response } from "npm:express@4.18.2";
import { Todo } from "../schema/index.ts";

export const router = Router();

router.get("/todos", (_req: Request, res: Response) => {
  Todo.find({}, (error: Error, doc: Array<typeof Todo>) => {
    if (error) {
      throw error;
    }
    if (!doc) {
      return res.status(404).send("No authors found.");
    }
    return res.status(200).send(doc);
  });
});

router.post("/todo", (req: Request, res: Response) => {
  const data = req.body;
  try {
    const todo = new Todo(data);
    todo.save();
    return res.status(201).send(todo);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
```

We are having the routes which are `/todos` which is accessed using the http `get` method to use mongose to query our `todos` and the other one is the `/todo` which is use to create a new todo in the mongodb database when we send a `post` request to the server. In our `index.ts` file we will have the following code in it:

```ts
// @deno-types="npm:@types/express@4.17.15"
import express, { Application } from "npm:express@4.18.2";
import { router } from "./routes/index.ts";
import { connect } from "npm:mongoose@^6.7";
const app: Application = express();
const PORT = 3001;

(async () => {
  await connect("mongodb://localhost:27017");
  app.use(express.json());
  app.use(router);
  app.listen(PORT, () =>
    console.log("the server is running on http://localhost:3001")
  );
})();
```

> This is a simple api for creating todos and getting all todos that are in the database. The api was tested using `requests.rest` vscode tool.

1. Creating a Todo

```ts

POST http://localhost:3001/todo
content-type: application/json

{
  "title": "there"
}

```

2. Getting all Todos

```ts
GET http://localhost:3001/todos

```
