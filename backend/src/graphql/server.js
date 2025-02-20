import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';

export const createApolloServer = () => {
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Add authentication context if needed
      const token = req.headers.authorization || '';
      return { token };
    },
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        locations: error.locations,
        path: error.path
      };
    }
  });
};
