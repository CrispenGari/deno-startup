### prisma

In this example we are going to learn how we can create a simple rest-api with `express` and `prisma`. First we need to generate the prisma schema by running the following command:

```shell
deno run --allow-read --allow-env --allow-net --allow-sys --allow-write npm:prisma@^4.5 init
```

Next we are going to create a `deno.json` file and add the following code in it:


```json
{
  "tasks": {
    "start": "deno run --watch --allow-sys --allow-net --allow-read --allow-env index.ts",

  },
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  }
}

```
