import { createClient } from "npm:redis@^4.5";

export const client = createClient({
  url: "redis://localhost:6379",
});
