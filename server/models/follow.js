const { ObjectId } = require("mongodb");
const { connect } = require("../config/mongodb");

class Follow {
  static async addFollow(newFollow) {
    try {
      const db = await connect();
      const follow = db.collection("follows");
      const result = await follow.insertOne(newFollow);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async addFollow(newFollow) {
    try {
      const db = await connect();
      const follow = db.collection("follows");
      const result = await follow.insertOne(newFollow);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  static async getFollow(userId) {
    try {
      const db = await connect();
      console.log(db);

      const aggFollower = [
        {
          '$match': {
            'followingId': new ObjectId(userId)
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'followerId',
            'foreignField': '_id',
            'as': 'followers'
          }
        }, {
          '$unwind': {
            'path': '$followers',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            '_id': 0,
            'username': '$followers.username'
          }
        }
      ];

      const aggFollowing = [
        {
          '$match': {
            'followerId': new ObjectId(userId)
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'followingId',
            'foreignField': '_id',
            'as': 'following'
          }
        }, {
          '$unwind': {
            'path': '$following',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$project': {
            '_id': 0,
            'username': '$following.username'
          }
        }
      ];

      const followers = await db
        .collection("follows")
        .aggregate(aggFollower)
        .toArray();

      const following = await db
        .collection("follows")
        .aggregate(aggFollowing)
        .toArray();

      // console.log(followers, '<--- followers');
      // console.log(following, '<--- following');

      return { followers, following };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Follow;
