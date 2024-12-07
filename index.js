require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.jqnby.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const sportCollection = client.db("sport-storeDB").collection("store");

    app.post('/equipment', async (req, res) => {
      const data = req.body;
      const result = await sportCollection.insertOne(data);
      res.send(result);
    })

    app.get('/equipment', async (req, res) => {
      const cursor = sportCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/allequipment', async (req, res) => {
      const cursor = sportCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/equipment/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await sportCollection.findOne(query);
      res.send(result);
    })

    app.delete('/equipment/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await sportCollection.deleteOne(query);
      res.send(result);
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
  res.send("Server is Running");
});

app.listen(port, () => {
  console.log(`Server Runngin on Port ${port}`)
})

