import * as React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./config/appolo11";
import AuthProvider from "./context/authContext";
import MainStack from "./navigators/MainStack";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <MainStack />
      </AuthProvider>
    </ApolloProvider>
  );
}
