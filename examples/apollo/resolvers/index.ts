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
