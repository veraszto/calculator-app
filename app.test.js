const {performOperation} = require('./operation');

jest.mock('mongodb');
jest.mock('./db.js');

const { getOperation, getRecords, insertRecord } = require('./db.js');

const Id1 = '66da85ed29b2a9cd74b855e7';
const Id2 = '66da86b2e6db449e72b216f4';

test('Perform sum 10 + 10 toBe 20', () => {
    getOperation.mockImplementation((selectedOperation) => {
        expect(selectedOperation).toBe('addition');
        return Promise.resolve({cost:10, _id: Id1});
    });
    getRecords.mockResolvedValue({records:[{user_id: Id2, user_balance: 39}]});
    insertRecord.mockImplementation((insertToDB) => {
        expect(insertToDB.operation_response).toBe(20);
    });
    performOperation('10+10', 'abcde');
});

test('Perform division by 0', async () => {
    const expectedReturn = {error: "Could not perform 10/0, division by zero", code: 400}
    getOperation.mockImplementation((selectedOperation) => {
        return Promise.resolve({cost:10, _id: Id1});
    });
    getRecords.mockResolvedValue({records:[{user_id: Id2, user_balance: 39}]});
    expect(await performOperation('10/0', 'abcde')).toMatchObject(expectedReturn);
});

test('Perform division 30 / 2  toBe 15', () => {
    getOperation.mockImplementation((selectedOperation) => {
        expect(selectedOperation).toBe('division');
        return Promise.resolve({cost:10, _id: Id1});
    });
    getRecords.mockResolvedValue({records:[{user_id: Id2, user_balance: 39}]});
    insertRecord.mockImplementation((insertToDB) => {
        expect(insertToDB.operation_response).toBe(15);
    });
    performOperation('30 / 2', 'abcde');
});

test('Perform subtraction 103 - 5 toBe 98', () => {
    getOperation.mockImplementation((selectedOperation) => {
        expect(selectedOperation).toBe('subtraction');
        return Promise.resolve({cost:10, _id: Id1});
    });
    getRecords.mockResolvedValue({records:[{user_id: Id2, user_balance: 39}]});
    insertRecord.mockImplementation((insertToDB) => {
        expect(insertToDB.operation_response).toBe(98);
    });
    performOperation('103 - 5', 'abcde');
});

test('Not enough balance', async () => {
    getOperation.mockImplementation((selectedOperation) => {
        expect(selectedOperation).toBe('multiplication');
        return Promise.resolve({cost:10, _id: Id1});
    });
    getRecords.mockResolvedValue({records:[{user_id: Id2, user_balance: 8}]});
    performOperation('16 * 16', 'abcde').then(result => {
        expect(result).toMatchObject({error: 'Not enough balance', code: 401});
    })
});

test('Perform multiplication 16 * 16 toBe 256', () => {
    getOperation.mockImplementation((selectedOperation) => {
        expect(selectedOperation).toBe('multiplication');
        return Promise.resolve({cost:10, _id: Id1});
    });
    getRecords.mockResolvedValue({records:[{user_id: Id2, user_balance: 39}]});
    insertRecord.mockImplementation((insertToDB) => {
        expect(insertToDB.operation_response).toBe(256);
    });
    performOperation('16 * 16', 'abcde');
});


