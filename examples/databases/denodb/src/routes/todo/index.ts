import { Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { isAuthenticated } from "../../middleware/index.ts";
import { __cookieName__ } from "../../constants/index.ts";
import { verifyJwt } from "../../utils/index.ts";
import { Todo, User } from "../../models/index.ts";

const todoRouter = new Router();

todoRouter
  .post("/create", async (ctx) => {
    const jwt = await ctx.cookies.get(__cookieName__);
    console.log({ jwt });
    await ctx.response.headers.set("Content-Type", "application/json");
    const value = ctx.request.body();
    if (value.type === "json") {
      try {
        const jwt = await ctx.cookies.get(__cookieName__);
        if (!jwt) {
          throw new Error("There's no token!");
        }
        const payload = await verifyJwt(jwt);
        const me = await User.where("id", payload.id)
          .select("id", "email", "created_at", "updated_at", "logged_in")
          .first();
        if (!me) {
          throw new Error("There's no me!");
        }
        const { title } = (await value.value) as {
          title: string;
        };
        if (title.trim().length < 3) {
          throw new Error("Todo tittle must contain at least 3 characters.");
        }
        const todo = await Todo.create({
          title,
          userId: me.id as number,
        });
        console.log({ todo });
        ctx.response.status = 200;
        return (ctx.response.body = todo);
      } catch (error) {
        ctx.response.status = 500;
        return (ctx.response.body = { error: error.message, code: 500 });
      }
    } else {
      ctx.response.status = 500;
      return (ctx.response.body = {
        message: "the request body must be in json format.",
        code: 500,
      });
    }
  })
  .get("/all", async (ctx) => {
    await ctx.response.headers.set("Content-Type", "application/json");

    try {
      ctx.response.status = 200;
      return (ctx.response.body = []);
    } catch (error) {
      ctx.response.status = 500;
      return (ctx.response.body = { error: error.message, code: 500 });
    }
  })
  .get("/one/:id", async (ctx) => {
    await ctx.response.headers.set("Content-Type", "application/json");
    try {
      ctx.response.status = 200;
      return (ctx.response.body = {});
    } catch (error) {
      ctx.response.status = 500;
      return (ctx.response.body = { error: error.message, code: 500 });
    }
  });

export default new Router()
  .use(isAuthenticated)
  .use("/todo", todoRouter.routes(), todoRouter.allowedMethods());
