const User = require("../models/user");
const { hashpw, comparePw } = require("../helpers/bcryptjs");
const { signToken, verifyToken } = require("../helpers/jwt");

const typeDefs = `#graphql

  type User {
    _id: String
    name: String
    username: String
    email: String
    password: String
  }

  type CreateUserInput {
    name: String
    username: String
    email: String
    password: String
  }

  type token {
    access_token: String
  }

  type Query {
    users: [User]
    userByUsername(username: String) : [User]
    userById(_id: String) : [User]
  }

  type Mutation {
    loginUser(username: String!, password: String!) : token
    registerUser(name: String, username: String, email: String, password: String) : User
  }
`;

const resolvers = {
  Query: {
    users: async () => {
      try {
        const users = User.getUser();
        console.log("user ///");
        return users;
      } catch (error) {
        console.log(error);
      }
    },
    userByUsername: async (_, args) => {
      try {
        const { username } = args;

        const user = await User.searchUser(username);

        return user;
      } catch (error) {
        console.log(error);
      }
    },
    userById: async (_, args) => {
      try {
        const { _id: id } = args;
        const user = await User.userById(id);
        return user;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    registerUser: async (_, args) => {
      let hash = args.password;
      hash = hashpw(hash);

      const newUser = {
        ...args,
        password: hash,
      };

      await User.register(newUser);

      return newUser;
    },
    loginUser: async (_, args) => {
      const { username, password } = args;

      const findUser = await User.login(username);

      if (!findUser) {
        throw new Error("User not found");
      }

      const verify = comparePw(password, findUser.password);

      if (!verify) {
        throw new Error("Invalid usernmae/password");
      }

      const payload = {
        id: findUser._id,
        email: findUser.email,
        username: findUser.username,
      };
      const token = signToken(payload);

      return {
        access_token: token,
      };
    },
  },
};

module.exports = { typeDefs, resolvers };
