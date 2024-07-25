const { ObjectId } = require("mongodb");
const Post = require("../models/post");
const redis = require("../config/redisConfig");

const typeDefs = `#graphql
  scalar Date
  # type
  type Comments {
    content: String
    username: String
    createdAt: Date
    updatedAt: Date
  }

  type Likes {
    username: String
    createdAt: Date
    updatedAt: Date
  }
 
  type Post {
    _id: String
    content: String
    tags: [String]
    imgUrl: String
    authorId: String
    postUser: PostUser
    comments: [Comments]
    likes: [Likes]
    createdAt: Date
    updatedAt: Date
  }

  type PostUser {
      _id: String 
      name: String
      username: String
      email: String
  }

  # input
  input CreatePostInput {
    content: String!
    tags: [String]!
    imgUrl: String!
  }

  input AddCommentInput {
    postId: String!
    content: String!
  }

  input AddTagInput {
    postId: String!
    tags: [String!]!
  }

  input AddLikeInput {
    postId: String!
  }

  # message
  type SuccessLike {
    message: String
  }

  type SuccessComment {
    message: String
  }

  type SuccessTag {
    message: String
  }

  type Query {
    posts: [Post]
    postById(_id: String) : Post
  }

  type Mutation {
    addPost(input: CreatePostInput) : Post
    addComment(input: AddCommentInput): SuccessComment
    addLike(input: AddLikeInput): SuccessLike
    addTag(input: AddTagInput): SuccessTag
  }
`;

const resolvers = {
  Query: {
    posts: async (_, args, contextValue) => {
      await contextValue.authentication();

      const postCache = await redis.get("post:all");
      if (postCache) {
        return JSON.parse(postCache);
      }

      const posts = await Post.getPost();
      await redis.set("post:all", JSON.stringify(posts));
      return posts;
    },
    postById: async (_, { _id }) => {
      const post = await Post.postById(_id);
      return post[0] || null;
    },
  },
  Mutation: {
    addPost: async (_, { input }, contextValue) => {
      try {
        const { id } = await contextValue.authentication();
        const newPost = {
          ...input,
          authorId: new ObjectId(id),
          comments: [],
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await Post.addPost(newPost);
        await redis.del("post:all");

        return newPost;
      } catch (error) {
        throw error;
      }
    },

    addComment: async (_, { input }, contextValue) => {
      try {
        const { username } = await contextValue.authentication();
        const { postId, content } = input;

        const comment = {
          content,
          username,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await Post.addComment(postId, comment);
        await redis.del("post:all");
        return { message: "success add comment!" };
      } catch (error) {
        throw error;
      }
    },
    addLike: async (_, { input }, contextValue) => {
      try {
        const { username } = await contextValue.authentication();
        const { postId } = input;

        const like = {
          username,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await Post.addLike(postId, like);
        await redis.del("post:all");
        return { message: "success like" };
      } catch (error) {
        console.log(error);
      }
    },
    addTag: async (_, { input }, contextValue) => {
      try {
        await contextValue.authentication();
        const { postId, tags } = input;

        await Post.addTags(postId, tags);
        await redis.del("post:all");
        return { message: "success add tags!" };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
