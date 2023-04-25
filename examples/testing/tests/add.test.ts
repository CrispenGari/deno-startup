import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { add } from "../src/add.ts";
Deno.test("Test Addition Function", () => {
  assertEquals(add(1, 3), 4, "1 + 1 !== 4");
});
