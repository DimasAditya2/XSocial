import { gql } from "@apollo/client";

export const REGISTER = gql`
  mutation RegisterUser(
    $name: String
    $email: String
    $username: String
    $password: String
  ) {
    registerUser(
      name: $name
      email: $email
      username: $username
      password: $password
    ) {
      _id
      name
      username
      email
      password
    }
  }
`;
