const { ObjectId } = require("mongodb");
const Follow = require("../models/follow");

const typeDefs = `#graphql
  scalar Date


  type Follow {
    _id: String
    followingId: String
    followerId: String
    createdAt: Date
    updatedAt: Date
  }

  input CreateInputFollow {
    followingId: String
  }

    type FollowResult {
      followers: [user]
      following: [user]
  }

  type user {
    username: String
  }

 
#[ { following: { username: 'aditya' } } ] <--- following

  type Query {
    getFollow(userId: ID!): FollowResult
  }

  type Mutation {
    addFollow(input: CreateInputFollow) : FollowResult
  }
`;

const resolvers = {
  Query: {
    getFollow: async (_, args, { authentication }) => {
      try {
        await authentication();
        const { userId } = args;
        console.log(userId, "< id");
        const result = await Follow.getFollow(userId);
        return result;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Mutation: {
    addFollow: async (_, { input }, contextValue) => {
      try {
        const { id } = await contextValue.authentication();
        const user = id;
        console.log(input, "input");
        const newFollow = {
          followingId: new ObjectId(input.followingId),
          followerId: new ObjectId(user),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await Follow.addFollow(newFollow);
        return newFollow;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
