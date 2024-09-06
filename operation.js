const { getOperation, getRecords, insertRecord, ObjectId } = require('./db.js');

const StringGeneratorUrl = "https://www.random.org/strings/?num=1&len=8&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new"

const Operations = {
    addition: /\d+((\.|,)\d+)?\s*\+\s*\d+((\.|,)\d+)?$/,
    subtraction: /\d+((\.|,)\d+)?\s*\-\s*\d+((\.|,)\d+)?$/,
    multiplication: /\d+((\.|,)\d+)?\s*\*\s*\d+((\.|,)\d+)?$/,
    division: /\d+((\.|,)\d+)?\s*\/\s*\d+((\.|,)\d+)?$/,
    square_root: /sqroot-?\d+((\.|,)\d+)?$/,
    random_string: /random_string/
}

const MatchNumber =  /-?\d+((\.|,)\d+)?/g;

async function performOperation(string, userId) {
    let selectedOperation = null;
    for(const [name, regex] of Object.entries(Operations)) {
        if (regex.test(string)) {
            selectedOperation = name;
            break;
        }
    }
    if (selectedOperation === null) {
        return {error: `${string} has not fit to any of the operations`, code: 400};
    }

    let randomString;
    if (selectedOperation === 'random_string') {
        try{
            randomString = await fetch(StringGeneratorUrl).then(res => res.text());
            console.log('/operation', randomString.toString());
        } catch(error) {
            return {error: 'Could not fetch from random.org', code: 401};
        }
    }

    console.log('/operation', selectedOperation);
    return getOperation(selectedOperation).then((operation)=>{
        console.log('/operation', operation)
        return getRecords(userId, 0, 1).then((latestRecord)=>{
            console.log('/operation', latestRecord.records)
            const { cost, _id } = operation;
            const { user_balance } = latestRecord.records[0];
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
            if (selectedOperation === 'square_root') {
                let result;
                const errorResponse = {error: `Could not perform square root from ${string} `, code: 400};
                try {
                    let number = string.match(MatchNumber)[0];
                    number = parseFloat(number);
                    result = Math.sqrt(number);
                    if (isNaN(result)) {
                        return errorResponse;
                    }
                } catch(error){
                    console.error(error);
                    return errorResponse;
                }
                return insertRecord(
                    {
                        user_balance: new_balance,
                        date: new Date(),
                        operation_id: _id,
                        user_id: new ObjectId(userId),
                        operation_response: result,
                        queried: string
                    }
                )
            }

            let result;
            //Since a mathematic expression has been asserted more above, 
            //maybe I could have just used eval()
            try {
                const numbers = string.match(MatchNumber);
                console.log('/operation', numbers);
                numbers[0] = parseFloat(numbers[0]);
                numbers[1] = parseFloat(numbers[1]);
                switch(selectedOperation) {
                    case 'multiplication':
                        result = numbers[0] * numbers[1]
                    break;
                    case 'addition':
                        result = numbers[0] + numbers[1]
                    break;
                    case 'subtraction':
                        result = numbers[0] - numbers[1]
                    break;
                    case 'division':
                        if (numbers[1] === 0) {
                            return {error: `Could not perform ${string}, division by zero`, code: 400};
                        }
                        result = numbers[0] / numbers[1]
                    break;
                }
            } catch(error) {
                console.error(error);
                return {error: `Could not perform ${string} `, code: 400};
            }
            return insertRecord(
                {
                    user_balance: new_balance,
                    date: new Date(),
                    operation_id: _id,
                    user_id: new ObjectId(userId),
                    operation_response: result,
                    queried: string
                }
            )
        })
    })

}

exports.performOperation = performOperation;
