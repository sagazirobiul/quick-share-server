const express = require('express')
const app = express()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5050;
app.use(express.json());
app.use(cors());
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cvfa5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const postCollection = client.db(`${process.env.DB_NAME}`).collection("posts");
    app.post("/addPost", (req, res) => {
        const postData = req.body;
        postCollection.insertOne(postData)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
    app.get("/posts", (req, res) => {
        postCollection.find({})
        .toArray((err, items) => {
            res.send(items)
        })
    })
    app.get('/myPosts', (req, res) => {
        postCollection.find({email: req.query.email})
        .toArray((err, items) => {
            res.send(items)
        })
    })
    
    app.get('/updatePost/:id', (req, res) => {
        postCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, items) => {
            res.send(items)
        })
    })

    app.delete('/delete/:id', (req, res) => {
        postCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then( result => {
            res.send(result.deletedCount > 0)
        })
    })

    app.patch('/update/:id', (req, res) => {
        postCollection.updateOne({_id: ObjectId(req.params.id)},{$set: req.body})
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
    })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)