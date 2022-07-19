import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URI,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHQL_API_BEARER_TOKEN}`,
      ...headers,
    }
  }
});

const gqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({ })
})

export { gqlClient }