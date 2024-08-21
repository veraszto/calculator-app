const { getOperation, getRecords, insertRecord, ObjectId } = require('./db.js');

const StringGeneratorUrl = "https://www.random.org/strings/?num=1&len=8&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new"

const operations = {
    addition:/\d+((\.|,)\d+)?\s*\+\s*\d+((\.|,)\d+)?$/,
    subtraction:/\d+((\.|,)\d+)?\s*\-\s*\d+((\.|,)\d+)?$/,
    multiplication:/\d+((\.|,)\d+)?\s*\*\s*\d+((\.|,)\d+)?$/,
    division:/\d+((\.|,)\d+)?\s*\/\s*\d+((\.|,)\d+)?$/,
    square_root:/sqroot\d+((\.|,)\d+)?$/,
    random_string: /random_string/
}

async function performOperation(string, userId) {
    let which = null;
    for(const [name, regex] of Object.entries(operations)) {
        if (regex.test(string)) {
            which = name;
            break;
        }
    }
    if (which === null) {
        return {error: 'Have not fit to any of the operations', code: 401};
    }

    let randomString;
    if (which === 'random_string') {
        try{
            randomString = await fetch(StringGeneratorUrl).then(res => res.text());
            console.log('/operation', randomString.toString());
        } catch(error) {
            return {error: 'Could not fetch from random.org', code: 401};
        }
    }

    console.log('/operation', which);
    return getOperation(which).then((operation)=>{
        console.log('/operation', operation)
        return getRecords(userId, 0, 1).then((latestRecord)=>{
            console.log('/operation', latestRecord)
            const { cost, _id } = operation;
            const { user_balance } = latestRecord[0];
            console.log('/operation', cost, user_balance);
            const new_balance = user_balance - cost;
            if (new_balance < 0) {
                return {error: 'Not enough balance', code: 401};
            }
            if (randomString) {
                return insertRecord(
                    {
                        user_balance: new_balance,
                        date: new Date(),
                        operation_id: _id,
                        user_id: new ObjectId(userId),
                        operation_response: randomString,
                        queried: string
                    }
                )
            }
            return latestRecord;
        })
    })

}

exports.performOperation = performOperation;
