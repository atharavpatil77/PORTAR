import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    // You can handle specific network errors here
    if (networkError.statusCode === 404) {
      console.error('GraphQL endpoint not found. Please check the server configuration.');
    }
  }
});

// HTTP connection link
const httpLink = createHttpLink({
  uri: 'http://localhost:5001/graphql',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auth link for adding headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchDrivers: {
            keyArgs: ['query', 'vehicleType', 'status'],
            merge(existing = { drivers: [] }, incoming, { args }) {
              if (!args?.page || args.page <= 1) {
                return incoming;
              }
              return {
                ...incoming,
                drivers: [...existing.drivers, ...incoming.drivers],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: true
});

export default client;
