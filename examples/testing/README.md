### testing

In this example we are going to write some test using deno. First we will create a `deno.json` and add the following code in it.

```json
{
  "tasks": {
    "start": "deno run --watch --allow-net --allow-read --allow-env index.ts",
    "test": "deno test tests/"
  },
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  }
}
```

So when we run the `deno task test` command this will test all the files test cases that will be found in any file under the `test/` directory. Let's go ahead and write some tests functions that are located in the `src` folder.

```ts
export const add = (a: number, b: number): number => a + b;
export const sub = (a: number, b: number): number => a - b;
```

1. `add.test.ts`

```ts
import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { add } from "../src/add.ts";
Deno.test("Test Addition Function", () => {
  assertEquals(add(1, 3), 4, "Failed");
});
```

2. `subtraction.test.ts`

```ts
import { assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { sub } from "../src/subtract.ts";

Deno.test("Testing for the Subtract Function", () => {
  assertEquals(sub(1, 3), -2, "Failed");
});
```

3. `add.test.ts`

```ts
import { assert } from "https://deno.land/std@0.182.0/testing/asserts.ts";

Deno.test("Test Assert", () => {
  assert(1);
  assert("Hello");
  assert(true);
});
```

Now to test you just run the following command:

```shell
deno task test
```

If you want to learn more about testing using deno read [here.](https://deno.com/manual@v1.32.3/basics/testing/assertions)
