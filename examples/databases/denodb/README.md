### DenoDB

In this one we are going to use `denodb` which is the orm database for `deno`. We are going to do crud operations. We will be using `postgres` as our database server. We are going to use the `oak` server so let's create a `deno.json` file and and the following to it:

```json
{
  "tasks": {
    "start": "deno run --watch --allow-sys --allow-net --allow-read --allow-env src/index.ts"
  },
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  }
}
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
  await db.sync({ drop: false });
  const app = new Application();
  app.addEventListener("listen", ({ port, hostname }) =>
    console.log(`The server is running on: http://${hostname}:${port}/`)
  );
  app.use(todoRouter.routes());
  await app.listen({ port: 3001, hostname: "127.0.0.1" });
})();
```

### Crud Operations

Next we are going to make crud operations on our `todos` and `user`

### Refs

1. [denodb](https://deno.land/x/denodb@v1.4.0)
2. [denodb-docs](https://eveningkid.com/denodb-docs/)
3. [oak](https://deno.land/x/oak@v12.4.0)
