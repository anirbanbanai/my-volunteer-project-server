const express = require('express');
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmvhoig.mongodb.net/?retryWrites=true&w=majority`;

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

        const volunteerCollection = client.db('volunteerDb').collection('vol')
        const volunteerCollection2 = client.db('volunteerDb').collection('user')

        app.get('/vol', async (req, res) => {
            const data = volunteerCollection.find();
            const result = await data.toArray();
            // console.log(result)
            res.send(result)
        })
        app.get('/add', async (req, res) => {
            const data = volunteerCollection2.find();
            const result = await data.toArray();
            // console.log(result)
            res.send(result)
        })

        app.post('/add', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await volunteerCollection2.insertOne(user);
            res.send(result)
        })
        app.post('/volunteer', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await volunteerCollection.insertOne(user);
            res.send(result)
        })

        app.put('/volunteer/:id', async(req, res)=>{
            const id = req.params.id;
            const User = req.body;
            console.log(id, User)
            const query = {_id: new ObjectId(id)}
            const updatedUser = {
                $set:{
                    name: User.name,
                    image: User.image,
                }
            }
            const result = await volunteerCollection.updateOne(query, updatedUser);
            res.send(result)

        })

        app.get('/volunteer/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const user  = await volunteerCollection.findOne(query);
            res.send(user)
        })

        app.delete('/add/:id', async(req, res)=>{
            const id  = req.params.id;
            console.log(id)
            const query = {_id: new ObjectId(id)}
            const result = await volunteerCollection2.deleteOne(query);
            res.send(result)
        })
        app.delete('/volunteer/:id', async(req, res)=>{
            const id  = req.params.id;
            console.log(id)
            const query = {_id: new ObjectId(id)}
            const result = await volunteerCollection.deleteOne(query);
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


app.get('/', (req, res) => {
    res.send('This is rumming project with volunteer')
})

app.listen(port, (req, res) => {
    console.log(`This server running on ${port}`)
})