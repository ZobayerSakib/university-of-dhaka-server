const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;


const { MongoClient } = require('mongodb');
require('dotenv').config()

app.use(cors());
app.use(express.json())


//MongoDb database Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3ndc9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected')

        const database = client.db("dhakaVarsity");
        const latestNewsCollection = database.collection("latestNews");

        //Latest News Sent from Database
        app.get('/news', async (req, res) => {
            const query = latestNewsCollection.find({})
            const result = await query.toArray()
            res.send(result)
        })

        //Post API Connection
        app.post('/news', async (req, res) => {
            const docs = req.body;
            const result = await latestNewsCollection.insertOne(docs);
            console.log(result)
            res.json(result)
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello ,Dhaka University, Congratulations! Server is ready to work')

})

app.listen(port, () => {
    console.log('Listening the port', port)
})