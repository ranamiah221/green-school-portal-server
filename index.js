const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 8000;
const app=express();
require('dotenv').config()

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ungcn7e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    const studentCollection = client.db("greenDB").collection("students");
    const teacherCollection = client.db("greenDB").collection("teachers");
   
    // students collection....
    app.post('/students', async(req, res)=>{
        const student = req.body;
        const result = await studentCollection.insertOne(student)
        res.send(result)
    })
    app.get('/students', async(req, res)=>{
        const result = await studentCollection.find().toArray();
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send("green school portal server")
})
app.listen(port, ()=>{
    console.log(`green school portal running on port: ${port}`);
})