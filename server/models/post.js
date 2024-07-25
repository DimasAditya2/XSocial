const { ObjectId } = require("mongodb");
const { connect } = require("../config/mongodb");

class Post {
  static async getPost() {
    try {
      const db = await connect();
      const posts = db.collection("posts");

      const agg = [
        {
          $sort: { createdAt: -1 },
        },
        {
          $lookup: {
            from: "users",
            let: { authorId: { $toObjectId: "$authorId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$authorId"] } } },
              { $project: { password: 0, createdAt: 0, updatedAt: 0 } },
            ],
            as: "postUser",
          },
        },
        {
          $unwind: {
            path: "$postUser",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const cursor = posts.aggregate(agg);
      const result = await cursor.toArray();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async addPost(newPost) {
    try {
      const db = await connect();
      const post = db.collection("posts");
      const result = await post.insertOne(newPost);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async postById(id) {
    try {
      const db = await connect();
      const post = db.collection("posts");
      const agg = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "users",
            let: { authorId: { $toObjectId: "$authorId" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$authorId"] } } },
              { $project: { password: 0, createdAt: 0, updatedAt: 0 } },
            ],
            as: "postUser",
          },
        },
        {
          $unwind: {
            path: "$postUser",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      const cursor = post.aggregate(agg);
      const data = await cursor.toArray();
      console.log(data);
      return data;
    } catch (error) {
      console.log("Error di postById:", error);
    }
  }

  static async addComment(postId, comment) {
    try {
      const db = await connect();
      const posts = db.collection("posts");
      const result = await posts.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { comments: comment } }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async addLike(postId, like) {
    try {
      const db = await connect();
      const posts = db.collection("posts");
      const result = await posts.updateOne(
        { _id: new ObjectId(postId) },
        { $push: { likes: like } }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async addTags(postId, tags) {
    try {
      const db = await connect();
      const posts = db.collection("posts");
      const result = await posts.updateOne(
        { _id: new ObjectId(postId) },
        { $addToSet: { tags: { $each: tags } } }
      );
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Post;
