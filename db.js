const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://garbini:ifnqJzvKs4hM2Br7@mycluster.kcj4x.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


function authenticate(username, password) {
    const userCollection = client.db('calculator').collection('user');
    return userCollection.findOne({username, password}).then((user)=>{
        if (!user) {
            return [];
        }
        return getRecords(user._id).then(records => records);
    }).catch((error)=>{
        console.log(error);
        return error;
    });
}

function getRecords(userId, skip) {
    const recordCollection = client.db('calculator').collection('record');
    return recordCollection.aggregate([
        {
            $match: {
                user_id: userId
            }
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
                _id: '-1'
            }
        },
        {
            $limit: 10 
        },
        {
            $skip: skip || 0
        }
    ]).toArray();
}

exports.client = client;
exports.authenticate = authenticate;

