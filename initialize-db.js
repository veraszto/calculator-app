const { client } = require('./db.js')


async function test() {
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

async function initialDbContent() {

    const calculatorDb = client.db("calculator");
    const userCollection = calculatorDb.collection('user');
    const operationCollection = calculatorDb.collection('operation');
    const recordCollection = calculatorDb.collection('record');

    const deleteAll = [userCollection.deleteMany({}), 
        operationCollection.deleteMany({}), recordCollection.deleteMany({})
    ]

    const deleted = await Promise.all(deleteAll);
    console.log(deleted);

    const insertUsers = await userCollection.insertMany([
        {username: 'danilo@me.com', 
            password: 'WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U=', status: 'active'},
        {username: 'ntd@ntd.com', 
            password: 'WZRHGrsBESr8wYFZ9sx0tPURuZgG2lmzyvWpwXPKz8U=', status: 'active'},

    ]);

    console.log(insertUsers);

    const insertOperations = await operationCollection.insertMany([
        {type:'addition', cost: 100},
        {type:'subtraction', cost: 200},
        {type:'multiplication', cost: 300},
        {type:'division', cost: 400},
        {type:'square_root', cost: 500},
        {type:'random_string', cost: 600},
    ]);

    console.log(insertOperations);

    const records = Object.values(insertUsers.insertedIds).map(id =>({
        user_id: id, user_balance: 50000, date: new Date()
    }))

    const insertRecords = await recordCollection.insertMany(records);

    console.log(insertRecords);
}

(async () => {
    try {
        await test();
        await initialDbContent();
    } catch(error) {
        console.log(error);
    } finally {
        await client.close();
    }
})();
