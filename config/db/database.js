const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://adminEduMatch:u4kXzZIbwdVkyMRz@cluster0.347dlsd.mongodb.net/?retryWrites=true&w=majority";
const dbName = 'edu-match-v1';

let db = null;

async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB successfully');
    db = client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Terminate the application if unable to connect to MongoDB
  }
}

function getDB() {
  if (!db) {
    throw new Error('Database connection has not been established.');
  }
  return db;
}

module.exports = {
  connectToMongoDB,
  getDB
};
