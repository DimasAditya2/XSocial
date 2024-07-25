const { GraphQLError } = require("graphql");
const { verifyToken } = require("../helpers/jwt");

async function authen(req) {
  try {
    const authorization = req.headers.authorization;

    if(!authorization) {
      throw new Error('Unauth')
    }

    const [type, token] = authorization.split(" ");

    if (type !== "Bearer") {
      throw new Error("Invalid token!");
    }

    const user = verifyToken(token);

    if (!user) {
      throw new Error("Invalid token!");
    }

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = authen;
