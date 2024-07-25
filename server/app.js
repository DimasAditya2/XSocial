require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const {
  typeDefs: typeDefsUser,
  resolvers: resolverUser,
} = require("./schemas/user");
const {
  typeDefs: typeDefsPost,
  resolvers: resolverPost,
} = require("./schemas/post");
const {
  typeDefs: typeDefsFollow,
  resolvers: resolverFollow,
} = require("./schemas/follow");


const authen = require("./middlewares/authentication");

const server = new ApolloServer({
  typeDefs: [typeDefsUser, typeDefsPost, typeDefsFollow],
  resolvers: [resolverUser, resolverPost, resolverFollow],
  introspection: true,
});

const startServer = async () => {
  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 3000 },
      context: ({ req }) => ({
        authentication: () => authen(req),
      }),
    });
    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
