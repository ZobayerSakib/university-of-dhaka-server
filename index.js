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
        const usersCollection = database.collection("users");

        //Latest News Sent from Database
        app.get('/news', async (req, res) => {
            const query = latestNewsCollection.find({})
            const result = await query.toArray()
            res.send(result)
        })

        //Post API Connection of Latest News
        app.post('/news', async (req, res) => {
            const docs = req.body;
            const result = await latestNewsCollection.insertOne(docs);
            console.log(result)
            res.json(result)
        })

        app.get('/user', async (req, res) => {
            const query = usersCollection.find({})
            const result = await query.toArray();
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result)
            res.json(result)
        })

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

        app.put('/user/admin', async (req, res) => {
            const newUser = req.body;
            console.log('put', newUser)
            const filter = { email: newUser.email }

            const updateInfo = { $set: { role: 'admin' } }
            console.log(updateInfo)
            const result = await usersCollection.updateOne(filter, updateInfo);
            res.json(result);
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