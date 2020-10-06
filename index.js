const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId



const port = 5000
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iymr7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteerCollections = client.db(`${process.env.DB_NAME}`).collection("volunteer");

  app.post('/addVolunteer', (req, res)=>{
    const volunteers = req.body
    console.log(volunteers)
    volunteerCollections.insertOne(volunteers)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
})

app.get("/genralUser", (req, res)=>{
  volunteerCollections.find({ email: req.query.email })
  .toArray((err, document) => {
    res.send(document)
  })
})

app.delete('/delet/:id', (req, res)=>{
  volunteerCollections.deleteOne({_id: ObjectId(req.params.id)})
  .then(result=>{
          res.send(result.deletedCount > 0)
  })
})
});


app.listen(process.env.PORT || port)