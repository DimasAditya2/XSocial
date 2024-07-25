const { ObjectId } = require("mongodb");
const { connect, database } = require("../config/mongodb");

class User {
  static async register(newUser) {
    const user = database.collection("users");
    const result = await user.insertOne(newUser);
    return result;
  }

  static async login(username) {
    const user = database.collection("users");
    const result = await user.findOne({ username });

    return result;
  }
  static async getUser() {
    const users = database.collection("users");
    const result = await users.find().toArray();

    return result;
  }

  static async searchUser(username) {
    try {
      const user = database.collection("users");
      let query = {};
      if (username) query.username = username;

      const result = await user.find(query).toArray();

      if (!result === '') {
        throw new Error("User Not Found!");
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async userById(id) {
    try {
      const db = await connect();
      const user = db.collection("users");
      let query = {};
      if (id) query._id = new ObjectId(id);
      const result = await user.find(query).toArray();

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = User;
