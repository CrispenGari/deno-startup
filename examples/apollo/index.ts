import { ApolloServer } from "npm:@apollo/server@^4.1";
import { startStandaloneServer } from "npm:@apollo/server@4.1/standalone";
import { resolvers } from "./resolvers/index.ts";
import { typeDefs } from "./schema/index.ts";
// import { graphql } from "npm:graphql@16.6";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server as any, {
  listen: { port: 3001 },
});

console.log(`Server running on: ${url}`);
