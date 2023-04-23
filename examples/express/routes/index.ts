import { Router, Request, Response } from "npm:express@4.18.2";

export const router = Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ msg: "Welcome to the Dinosaur API!" });
});
