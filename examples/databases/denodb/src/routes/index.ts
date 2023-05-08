import { Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";

export const todoRouter = new Router({
  prefix: "/api/todo",
  methods: ["GET", "POST", "PUT", "DELETE"],
});
todoRouter
  .get("/one/:id", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/all", (context) => {
    context.response.body = [];
  });
