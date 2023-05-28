import { Router } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";
// import { signJwt, verifyJwt } from "../../utils/index.ts";
import { User } from "../../models/index.ts";
import { signJwt, verifyJwt } from "../../utils/index.ts";
import { __cookieName__ } from "../../constants/index.ts";
const authRouter = new Router();

authRouter
  .get("/me", async (ctx) => {
    await ctx.response.headers.set("Content-Type", "application/json");
    try {
      const jwt = await ctx.cookies.get(__cookieName__);
      if (!jwt) {
        ctx.response.status = 200;
        return (ctx.response.body = { me: null });
      }
      const payload = await verifyJwt(jwt);
      const me = await User.where("id", payload.id)
        .select("id", "email", "created_at", "updated_at", "logged_in")
        .first();
      if (!me) {
        throw new Error("There's no me!");
      }
      const _jwt = await signJwt({
        email: me.email as string,
        id: me.id as number,
      });
      await ctx.cookies.set(__cookieName__, _jwt, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      ctx.response.status = 200;
      return (ctx.response.body = {
        me,
      });
    } catch (error) {
      ctx.response.status = 500;
      return (ctx.response.body = {
        message: error.message,
        code: 500,
      });
    }
  })
  .post("/login", async (ctx) => {
    await ctx.response.headers.set("Content-Type", "application/json");
    const value = ctx.request.body();
    if (value.type === "json") {
      try {
        const { email, password } = (await value.value) as {
          email: string;
          password: string;
        };

        const exists = await User.where(
          "email",
          email.trim().toLowerCase()
        ).first();
        if (!exists) {
          ctx.response.status = 200;
          return (ctx.response.body = {
            user: null,
            error: {
              message: "invalid email address.",
              field: "email",
            },
          });
        }
        const correct = await bcrypt.compare(
          password,
          exists.password as string
        );
        if (!correct) {
          ctx.response.status = 200;
          return (ctx.response.body = {
            user: null,
            error: {
              message: "invalid account password.",
              field: "password",
            },
          });
        }
        const me = await User.where("email", email.trim().toLowerCase())
          .select("id", "email", "created_at", "updated_at", "logged_in")
          .first();
        if (!me) {
          throw new Error("There's no me!");
        }
        const jwt = await signJwt({
          email: me.email as string,
          id: me.id as number,
        });
        await ctx.cookies.set(__cookieName__, jwt, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
        });
        ctx.response.status = 200;
        return (ctx.response.body = {
          error: null,
          user: me,
        });
      } catch (error) {
        console.log({ error });
        ctx.response.status = 500;
        return (ctx.response.body = {
          message: error.message,
          code: 500,
        });
      }
    } else {
      ctx.response.status = 500;
      return (ctx.response.body = {
        message: "the request body must be in json format.",
        code: 500,
      });
    }
  })
  .post("/register", async (ctx) => {
    await ctx.response.headers.set("Content-Type", "application/json");
    const value = ctx.request.body();
    if (value.type === "json") {
      try {
        const { email, password } = (await value.value) as {
          email: string;
          password: string;
        };

        if (!email.includes("@")) {
          ctx.response.status = 200;
          return (ctx.response.body = {
            user: null,
            error: {
              message: "invalid email address",
              field: "email",
            },
          });
        }

        if (password.trim().length < 5) {
          ctx.response.status = 200;
          return (ctx.response.body = {
            user: null,
            error: {
              message: "password must be at least 5 characters long",
              field: "password",
            },
          });
        }

        const hash = await bcrypt.hash(password.trim());
        const exits = await User.where(
          "email",
          email.trim().toLowerCase()
        ).first();

        if (exits) {
          ctx.response.status = 200;
          return (ctx.response.body = {
            user: null,
            error: {
              message: "the email address is already taken.",
              field: "email",
            },
          });
        }
        await User.create({
          email: email.trim().toLowerCase(),
          password: hash,
        });
        const me = await User.where("email", email.trim().toLowerCase())
          .select("id", "email", "created_at", "updated_at", "logged_in")
          .first();
        if (!me) {
          throw new Error("There's no me!");
        }
        const jwt = await signJwt({
          email: me.email as string,
          id: me.id as number,
        });
        await ctx.cookies.set(__cookieName__, jwt, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });
        ctx.response.status = 200;
        return (ctx.response.body = {
          error: null,
          user: me,
        });
      } catch (error) {
        ctx.response.status = 500;
        return (ctx.response.body = {
          message: error.message,
          code: 500,
        });
      }
    } else {
      ctx.response.status = 500;
      return (ctx.response.body = {
        message: "the request body must be in json format.",
        code: 500,
      });
    }
  })
  .post("/logout", async (ctx) => {
    await ctx.response.headers.set("Content-Type", "application/json");
    await ctx.cookies.delete(__cookieName__, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return (ctx.response.body = {
      me: null,
    });
  });
export default new Router().use(
  "/auth",
  authRouter.routes(),
  authRouter.allowedMethods()
);
