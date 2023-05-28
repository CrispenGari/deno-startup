import { Middleware } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { signJwt, verifyJwt } from "../utils/index.ts";
import { __cookieName__ } from "../constants/index.ts";
import { User } from "../models/index.ts";

export const isAuthenticated: Middleware = async (ctx, next) => {
  await ctx.response.headers.set("Content-Type", "application/json");
  try {
    const jwt = await ctx.cookies.get(__cookieName__);
    if (!jwt) {
      return (ctx.response.body = {
        code: 401,
        message: "You are not authenticated.",
      });
    }
    const payload = await verifyJwt(jwt);
    const me = await User.where("id", payload.id)
      .select("id", "email", "created_at", "updated_at", "logged_in")
      .first();
    console.log({ me });
    if (!me) {
      return (ctx.response.body = {
        code: 401,
        message: "You are not authenticated.",
      });
    }

    const _jwt = await signJwt({
      email: me.email as string,
      id: me.id as number,
    });
    await ctx.cookies.set(__cookieName__, _jwt, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    return next();
  } catch (error) {
    return (ctx.response.body = {
      message: error.message,
      code: 500,
    });
  }
};
