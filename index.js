const express = require('express');
const app = express();
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

    const getData = (url, findObj = {}) => {
        app.get(url, (req, res) => {
            postCollection.find(
                findObj === 'email' ? {email: req.params.email}:
                findObj === 'id'? {_id: ObjectId(req.params.id)}: null
            )
            .toArray((err, items) => {
                res.send(items)
            })
        })
    }
    getData('/posts');
    getData('/myPosts/:email', 'email');
    getData('/updatePost/:id', 'id');

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