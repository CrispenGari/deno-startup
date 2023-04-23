import { readFileSync } from "node:fs";
console.log(readFileSync("deno.json", { encoding: "utf8" }));
