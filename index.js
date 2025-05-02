const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const subjectCollection = client.db("greenDB").collection("subjects");
    const questionCollection = client.db("greenDB").collection("questions");
    const noticeCollection = client.db("greenDB").collection("notices");
   
    // students collection....
    app.get('/students', async(req, res)=>{
        const result = await studentCollection.find().toArray();
        res.send(result)
    })
    app.post('/students', async(req, res)=>{
        const student = req.body;
        const result = await studentCollection.insertOne(student)
        res.send(result)
    })
    app.delete('/students/:id', async(req, res)=>{
      const id = req.params.id;
      const query={_id : new ObjectId(id)}
      const result = await studentCollection.deleteOne(query)
      res.send(result)
    })

    // find a specific id...
    app.get('/students/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await studentCollection.findOne(query)
      res.send(result)
    })

    // teachers collections....
    app.get('/teachers', async(req, res)=>{
        const result = await teacherCollection.find().toArray();
        res.send(result)
    })
    app.post('/teachers', async(req, res)=>{
        const teacher = req.body;
        const result = await teacherCollection.insertOne(teacher)
        res.send(result)
    })


    // subject releted api..
    app.get('/subjects', async(req, res)=>{
        const result = await subjectCollection.find().toArray();
        res.send(result)
    })
    app.post('/subjects', async(req, res)=>{
      const subject= req.body;
      const result = await subjectCollection.insertOne(subject)
      res.send(result)
    })
    app.delete('/subjects/:id', async(req, res)=>{
      const id = req.params.id;
      const qurey = {_id : new ObjectId(id)}
      const result = await subjectCollection.deleteOne(qurey)
      res.send(result)
    })



    // questions api...
    app.get('/questions', async(req, res)=>{
      const cursor = await questionCollection.find().toArray();
      res.send(cursor)
    })

    app.post('/questions', async(req, res)=>{
      const question = req.body;
      const result = await questionCollection.insertOne(question)
      res.send(result)
    })

    // notice releted Api...
    app.get('/notices', async(req, res)=>{
      const cursor = await noticeCollection.find().toArray()
      res.send(cursor);
    })
    app.post('/notices', async(req, res)=>{
      const noticeInfo = req.body;
      const result = await noticeCollection.insertOne(noticeInfo);
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