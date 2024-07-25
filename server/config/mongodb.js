
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.URI_MONGODB

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connect() {
  try {
    await client.connect();
    const database = client.db('XE');

    database.client = client;
    return database;
  } catch (error) {
    console.error("Gagal :(", error);
    throw error;
  }
}


const database = client.db('XE')

module.exports = {database, connect}


