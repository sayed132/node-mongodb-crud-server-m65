const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

// pass: OB75vWEApETB485Y
// user: dbuser3


const uri = "mongodb+srv://dbuser3:OB75vWEApETB485Y@cluster0.taqpwn0.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const userCollection = client.db('nodeMOngoCrud').collection('users');


        app.get('/users', async(req, res)=>{
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        })

        app.post('/users', async (req, res)=>{
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result)

        });

        app.put('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const user = req.body;
            const option = {upsert: true}
            const updateUser = {
                $set:{
                    name: user.name,
                    address: user.address,
                    email: user.email,
                }
            };
            const result = await userCollection.updateOne(filter, updateUser, option)
            console.log(result);
            res.send(result)
        })

        app.delete('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            // console.log('trying to delete', id);
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result)
        })
    }
    finally{

    }
    // try{
    //     const userCollection = client.db('nodeMongodbCrud').collection('users');
    //     const user = {
    //         name: 'emamah find',
    //         email: 'efgyhhg@gmail.com'
    //     }
    //     const result = await userCollection.insertOne(user);
    //     console.log(result);
    // }
    // finally{

    // }
}
run().catch(error => console.log(error))

app.get('/', (req, res )=>{
    res.send('mongodb server api running')
});

app.listen(port, ()=>{
    console.log(`mongodb server running on port ${port}`);
})