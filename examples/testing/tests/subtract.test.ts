import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { sub } from "../src/subtract.ts";

Deno.test("Testing for the Subtract Function", () => {
  assertEquals(sub(1, 3), -2, "Failed");
});
