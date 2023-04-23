### hello world.

In this example we are going to write our `hello-world` program in `deno`, first we create a file called `main.ts` and add the following code in it:

```ts
console.log("Hello World!!");
```

Then navigate to the root folder where your file is located and run the script using the following command:

```shell
deno run main.ts
```

You will get the following output from the console.

> "Hello World!!"

The good thing about `deno` is that you can run remote file locally that are coming from `deno-land`. Here is an example:

```shell
deno run https://deno.land/std@0.182.0/examples/colors.ts
```

### Creating a simple HTTP server

Let's create a simple `http` server using `deno`. We will open our `main.ts` and add the following.

```ts
import { serve } from "https://deno.land/std@0.184.0/http/server.ts";

const PORT = 3001;
const handler = (): Response => {
  return new Response(
    JSON.stringify({
      message: "Hello world",
    }),
    {
      status: 200,
      statusText: "ok",
      headers: {
        "content-type": "application/json",
      },
    }
  );
};

serve(handler, {
  port: PORT,
  hostname: "localhost",
  onListen: ({ hostname, port }) => {
    console.log(`The server is running on port: http://${hostname}:${port}`);
  },
});
```

Now to start the script you run the following command:

```shell
deno run --allow-net main.ts
```

Now in the console you will be able to see the following in your logs:

```shell
The server is running on port: http://localhost:3001
```

Now if you visit `http://localhost:3001` you will be able to get the following `json` response.

```json
{
  "message": "Hello world"
}
```

### Deno CLI

In this section we are going to learn how we can use the deno `Command Line Interface`. We are going to have a look at the most important command lines but for the rest you can have a look at them in the [documentation](https://deno.land/manual@v1.32.3/getting_started/command_line_interface).

1. `--allow-net` this is used to give network permissions to deno. For example:

```shell
deno run --watch main.ts
```

2. `--watch` - used to watch the changes in the `main.ts` file and restart the server.

```shell
deno run --watch --allow-net main.ts
```

3. `check` - used to check for the errors in the file.

```shell
deno check main.ts
```

### Configuration

Deno supports a configuration file that allows you to customize the built-in TypeScript compiler, formatter, and linter. You can read more about it in [here](https://deno.land/manual@v1.32.3/getting_started/configuration_file).

all you need is to create a `deno.json` file in the root folder of your project and `deno` will be able to pick it up. Here is how the file can look:

```json
{
  "imports": {
    "std/": "https://deno.land/std@0.184.0/"
  },
  "tasks": {
    "start": "deno run --watch --allow-net main.ts"
  },
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  }
}
```

You can also pass the `compilerOptions` or typescript configurations within this `deno.json`

Now you can start the `main.ts` file by running

```shell
deno task start
```

Now that you have set the `imports` in your `deno.json` file you can change how you import things in your `main.ts` file to:

```ts
import { serve } from "std/http/server.ts";
```

### Modules

Deno allows us to create local and call remote modules. Let's create a local module called `math.ts` and add the following code in it:

```ts
export const add = (a: number, b: number): number => a + b;
```

To use this module in the `main.ts` this is how it is done:

```ts
import { add } from "./math.ts";
console.log({ sum: add(2, 3) });
```

### Using Node Modules

Deno supports node modules, let's try to use the module `chalk` in our main.ts file. Here is how we can use it:

```ts
import chalk from "npm:chalk@5";
console.log(chalk.red("Hello there!!"));
```

Then you need to run:

```shell
deno run --allow-sys main.ts
```

We can pass the `--node-modules-dir` flag

```shell
deno run --node-modules-dir main.ts
```

> npm specifiers resolve npm packages to a central global npm cache. This works well in most cases and is ideal since it uses less space and doesn't require a node_modules directory.

Deno also support using built in node modules by using the `node:` specifier. Here is how we can use native node modules in `deno`.

```ts
import { readFileSync } from "node:fs";
console.log(readFileSync("deno.json", { encoding: "utf8" }));
```

### `package.json`

Deno also allows us to resolve packages from `package.json` file.

```json
{
  "name": "hello",
  "description": "An example app created with Deno",
  "type": "module",
  "scripts": {
    "dev": "deno run --allow-env --allow-sys  --allow-read main.ts"
  },
  "dependencies": {
    "chalk": "^5.2"
  },
  "devDependencies": {
    "@types/node": "18.16.0"
  }
}
```

In the `main.ts` we will have the following code in it:

```ts
import { readFileSync } from "node:fs";
console.log(readFileSync("deno.json", { encoding: "utf8" }));
```

Now to run the `main.ts` file we will run it using the `dev` script as follows:

```shell
deno task dev
```

### References.

1. [Deno](https://deno.com/manual@v1.32.3/advanced/typescript/types)
