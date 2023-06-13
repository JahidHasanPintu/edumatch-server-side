const express = require("express");
const app = express();

const http = require('http');
const socketIO = require('socket.io');

const cors = require('cors');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = socketIO(server);

const { MongoClient, ObjectId, ObjectID } = require('mongodb');
const proposalController = require("./controllers/proposalController");
const { connectToMongoDB, getDB } = require("./config/db/database");
const chatController = require("./controllers/chatController");
const requestsController = require("./controllers/requestsController");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hi, Welcome to edumatch");
});


async function startServer() {
  await connectToMongoDB();

  const proposalCollection = getDB().collection('proposals');
  const chatCollection = getDB().collection('messages');
  const requestsCollection = getDB().collection('requests');

  // Pass app and proposalCollection to the proposalController
  proposalController(app, proposalCollection);
  chatController(io, chatCollection);
  requestsController(app, requestsCollection);

  app.listen(PORT, () => {
    console.log(`Edumatch server is running on port ${PORT}`);
  });
}

startServer().catch(console.error);



