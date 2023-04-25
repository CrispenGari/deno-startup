import { assert } from "https://deno.land/std@0.182.0/testing/asserts.ts";

Deno.test("Test Assert", () => {
  assert(1);
  assert("Hello");
  assert(true);
});
