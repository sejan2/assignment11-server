const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwlhu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        // console.log('connect')
        const database = client.db('hotel_services');
        const serveCollection = database.collection('services');
        const orderCollection = database.collection('orders')

        // insert all data
        app.get('/services', async (req, res) => {
            const cursor = serveCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectId(id) };
            const course = await serveCollection.findOne(query)
            res.json(course)
        })
        app.post('/serve', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })
        // api get for order
        app.get('/myOrder', async (req, res) => {
            const cursor = orderCollection.find({});
            const myorder = await cursor.toArray();
            res.send(myorder)
        })

        app.delete('/myOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            console.log('delete user', result)
            res.json(result)
        })

        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serveCollection.insertOne(service)
            console.log('yahoo', result)
            res.json(result)
        })

        // update approve
        app.put('/myOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const course = {
                $set: {
                    status: 'Approved'
                },
            };
            const result = await orderCollection.updateOne(query, course)
            res.json(result)
            console.log(result)
        })


    }
    finally {
        // await client .close()
    }
}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('Hello!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})