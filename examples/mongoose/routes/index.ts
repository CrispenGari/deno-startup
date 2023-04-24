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
