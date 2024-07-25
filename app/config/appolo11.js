import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import * as SecureStorage from "expo-secure-store";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://gc1-p3.dimasgans.site",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await SecureStorage.getItemAsync("access_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
