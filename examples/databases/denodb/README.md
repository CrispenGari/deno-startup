### DenoDB

In this one we are going to use `denodb` which is the orm database for `deno`. We are going to do crud operations. We will be using `postgres` as our database server. We are going to use the `oak` server so let's create a `deno.json` file and and the following to it:

```json
{
  "tasks": {
    "start": "deno run --watch --allow-sys --allow-net --allow-read --allow-env src/index.ts"
  },
  "scopes": {
    "https://raw.githubusercontent.com/Zhomart/dex/": {
      "https://deno.land/std/": "https://deno.land/std@0.177.0/"
    }
  },
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  }
}
```

Make sure that you add `scopes` property in your `deno.json` and should look as follow:

```json
{
  ...
  "scopes": {
    "https://raw.githubusercontent.com/Zhomart/dex/": {
      "https://deno.land/std/": "https://deno.land/std@0.177.0/"
    }
  }
}
```

Otherwise you will get the error saying:

```shell
error: Module not found "https://deno.land/std/node/events.ts".
    at https://raw.githubusercontent.com/Zhomart/dex/930253915093e1e08d48ec0409b4aee800d8bd0c/lib-dyn/deps.ts:7:24
```

In the `src/index.ts` we are going to add the following code in it:

```ts
import { Application } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { todoRouter } from "./routes/index.ts";
const app = new Application();

app.addEventListener("listen", ({ port, hostname }) =>
  console.log(`The server is running on: http://${hostname}:${port}/`)
);
app.use(todoRouter.routes());
await app.listen({ port: 3001, hostname: "127.0.0.1" });
```

### Setting up `orm`

Next we are going to setup `denodb` we are going to create our models in the `models/index.ts` file and we are going to link the `User` with the `Todo` here is how this file looks like:

```ts
import {
  ModelDefaults,
  ModelFields,
} from "https://deno.land/x/denodb@v1.3.0/lib/model.ts";
import {
  Model,
  DataTypes,
  Relationships,
} from "https://deno.land/x/denodb@v1.3.0/mod.ts";

export class User extends Model {
  static table = "users";
  static fields: ModelFields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    loggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  };
  static todos() {
    return this.hasMany(Todo);
  }
  static defaults: ModelDefaults = {
    loggedIn: false,
  };
  static timestamps = true;
}

export class Todo extends Model {
  static table = "todo";
  static fields: ModelFields = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tittle: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  };
  static user() {
    return this.hasOne(User);
  }
  static defaults: ModelDefaults = {
    completed: false,
  };
  static timestamps = true;
}

Relationships.belongsTo(Todo, User);
```

We need to create a `db` instance in our `db/index.ts` file and add the following code in it:

```ts
import {
  Database,
  PostgresConnector,
} from "https://deno.land/x/denodb@v1.3.0/mod.ts";

const connector = new PostgresConnector({
  database: "todo",
  host: "localhost",
  username: "postgres",
  password: "root",
  port: 5432,
});

export const db = new Database(connector);
```

Then we need to open the `index.ts` and make sure that we are linking our database tables as follows:

```ts
import { Application } from "https://deno.land/x/oak@v12.4.0/mod.ts";
import { todoRouter } from "./routes/index.ts";
import { db } from "./db/index.ts";
import { Todo, User } from "./models/index.ts";

(async () => {
  await db.link([User, Todo]);
  // await db.sync({ drop: false }) //-> you only sync when you create a new model;
  const app = new Application();
  app.addEventListener("listen", ({ port, hostname }) =>
    console.log(`The server is running on: http://${hostname}:${port}/`)
  );
  app.use(todoRouter.routes());
  await app.listen({ port: 3001, hostname: "127.0.0.1" });
})();
```

### Crud Operations

Next we are going to make crud operations on our `todos` and `user`. This is what we are going to build and test on `POSTMAN` client:

1. API endpoints that allows users to:

- register
- login
- logout

2. API endpoints that allows only authenticated users to:

- create a todo
- read a todo
- list all todos
- delete todos
- update todo

We are going to use `jwt` tokens to authenticate the user and store tokens as cookies. So Let's get into code:

First we will need to create our `utility` functions in the `src/utils/index.ts` and add the following to it:

```ts
import jwt from "npm:jsonwebtoken@8.5.1";
import { load } from "https://deno.land/std@0.186.0/dotenv/mod.ts";
const env = await load();
export const signJwt = async ({
  id,
  email,
}: {
  email: string;
  id: number;
}): Promise<string> => {
  return await jwt.sign(
    {
      id,
      email,
    },
    env.JWT_TOKEN_SECRETE
  );
};

export const verifyJwt = async (token: string) => {
  return (await jwt.verify(token, env.JWT_TOKEN_SECRETE)) as {
    email: string;
    id: number;
  };
};
```

Now that we have our `utils` functions we are then going to start implementing the `login`, `register` and `logout` functionality in the `routes/user/index.ts` and this file will contain the following code in it:

```ts
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
        path: "/",
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
          path: "/",
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
      path: "/",
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
```

Now we want to create a middleware called `isAuth` that will protect our todo's route for un authenticated users:

```ts
// src/middlewares/index.ts
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
```

Now we can go ahead and implement the `CRUD` operations on `Todos` model. In our `src/routes/todo/index.ts` we are going to add the following code to it:

```ts

```

### Refs

1. [denodb](https://deno.land/x/denodb@v1.4.0)
2. [denodb-docs](https://eveningkid.com/denodb-docs/)
3. [oak](https://deno.land/x/oak@v12.4.0)
