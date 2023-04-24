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
