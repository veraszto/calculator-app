const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const {createHash} = require("node:crypto");

const Uri = process.env.CALCULATOR_APP_MONGODB_URI

const client = new MongoClient(Uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

function getOperation(type) {
    const operationCollection = client.db('calculator').collection('operation');
    return operationCollection.findOne({type}).then((operationFound)=>operationFound);
}

function authenticate(username, password) {
    const userCollection = client.db('calculator').collection('user');
    return userCollection.findOne({
        username, password: createHash('sha256').update(password).digest('base64')
    }).then((user)=>{
        if (!user) {
            return null;
        }
        return user;
    });
}

function softDelete(recordId) {
    const recordCollection = client.db('calculator').collection('record');
    return recordCollection.updateOne(
        {_id: new ObjectId(recordId)},
        {
            $set: {deleted: true}
        }
    )
}

function insertRecord(record) {
    const recordCollection = client.db('calculator').collection('record');
    return recordCollection.insertOne(record);
}

function getRecords(userId, skip = 0, limit = 10) {
    const match = {
        user_id: new ObjectId(userId),
        deleted: { $ne: true },
    }
    const recordCollection = client.db('calculator').collection('record');
    return recordCollection.find({...match, operation_response: {$exists: true}}).count().then((count)=>{
        return recordCollection.aggregate([
            {
                $match: match
            },
            {
                $lookup: {
                    from: 'user',
                    localField:'user_id',
                    foreignField:'_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'operation',
                    localField: 'operation_id',
                    foreignField: '_id',
                    as: 'operation'
                }
            },
            {
                $sort: {
                    _id: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            }
        ]).toArray().then((records) => {
            return {totalRecords: count, skip, records}
        });
    })
    
}

exports.client = client;
exports.ObjectId = ObjectId;
exports.authenticate = authenticate;
exports.getRecords = getRecords;
exports.getOperation = getOperation;
exports.insertRecord = insertRecord;
exports.softDelete = softDelete;

