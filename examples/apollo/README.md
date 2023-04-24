### graphql-apollo

In this simple example we are going to have a look at how to integrate `apollo` and `deno`. First lets create our graphql schema in a file called `schema/index.ts` and add the following code to it:

```ts
export const typeDefs = `
  type User {
    username: String!
    id: Int!
    name: String!
    email: String!
  }
  type Query {
    users: [User!]
    user(id: Int!): User
  }
`;
```

Now that we have our `schema` we are going to create the resolver that will help us to query `users` and a single `user` from the `json-placeholder` api. In the `resolvers/index.ts` we are going to have the following code in it:

```ts
export const resolvers = {
  Query: {
    users: async () => {
      const res = await fetch("https://jsonplaceholder.typicode.com/users");
      const users = await res.json();
      return users;
    },
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    user: async (_: any, args: { id: number }) => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/users/${args.id}`
      );
      const user = await res.json();
      return user;
    },
  },
};
```

In the `index.ts` we will have the following code in it:

```ts
import { ApolloServer } from "npm:@apollo/server@^4.1";
import { startStandaloneServer } from "npm:@apollo/server@4.1/standalone";
import { resolvers } from "./resolvers/index.ts";
import { typeDefs } from "./schema/index.ts";
import { graphql } from "npm:graphql@16.6";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server as any, {
  listen: { port: 3001 },
});

console.log(`Server running on: ${url}`);
```

Now if we start the server by running the following command:

```ts
deno task start
```

And if we open `http://localhost:3001/` we will be presented with a `graphql` playground and we can be able to test our `api` by querying all users or a single user.

1. single user

If we query the user as follows

```
fragment UserFragment on User{
    email
    id
    name
    username
}
query UserQuery($userId: Int!) {
  user(id: $userId) {
   ...UserFragment
  }
}

```

With the following query variables

```json
{
  "userId": 2
}
```

We will get the response that looks as follows:

```json
{
  "data": {
    "user": {
      "email": "Shanna@melissa.tv",
      "id": 2,
      "name": "Ervin Howell",
      "username": "Antonette"
    }
  }
}
```

2. All users:

You can query all users as follows:

```
fragment UserFragment on User{
    email
    id
    name
    username
}
query UsersQuery {
  users {
   ...UserFragment
  }
}

```

To get the response that looks as follows:

```json
{
  "data": {
    "users": [
      {
        "email": "Sincere@april.biz",
        "id": 1,
        "name": "Leanne Graham",
        "username": "Bret"
      },
      {
        "email": "Shanna@melissa.tv",
        "id": 2,
        "name": "Ervin Howell",
        "username": "Antonette"
      },
      ...
    ]
  }
}
```
