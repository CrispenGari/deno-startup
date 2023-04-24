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
