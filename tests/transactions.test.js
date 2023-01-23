const { expect, get } = require('./helper');

let cycleId = '';
let transactionId = '';
const oldBeforeDate = 'before=01/02/2021';
const afterDate = 'after=01/01/2022';
let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';

const today = new Date();
const beforeDate = 'before=' + (today.getMonth() + 1) + '/' + today.getDate() + '/' + (today.getFullYear() + 1);

describe("GET /cycles/transactions", function () {
    it("gets the transactions for all cycles in the account", async function () {
        const response = await get('/cycles/transactions?pageSize=100', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length.gt(0);

        cycleId = response.body[0].CycleId;
        transactionId = response.body[0].Id;
    }).timeout(5000);

    it("gets the transactions for all cycles in the account with before and after dates", async function () {
        const response = await get('/cycles/transactions?' + afterDate + '&' + beforeDate + '&' + 'status=Completed', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length.gt(0);
    }).timeout(5000);

    it("gets the transactions for all cycles in the account with before and after dates in the past", async function () {
        const response = await get('/cycles/transactions?' + afterDate + '&' + oldBeforeDate, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.lengthOf(0);
    }).timeout(5000);

    it("gets the transactions for a cycles", async function () {
        const response = await get('/cycles/' + cycleId + '/transactions', accountId)
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length.gt(0);
    }).timeout(5000);

    it("gets the transactions for a cycles with after before dates and status and and split-type", async function () {
        const response = await get('/cycles/' + cycleId + '/transactions?' + afterDate + '&' + beforeDate + '&' + 'status=completed' + '&' + 'splitType=Unsplit', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length.gt(0);
    }).timeout(5000);

    it("gets the transaction items for the specified transaction", async function () {
        const response = await get('/cycles/' + cycleId + '/transactions/' + transactionId, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length.gt(0);
    }).timeout(5000);

    it("gets the transaction items for the specified transaction with search query", async function () {
        const response = await get('/cycles/' + cycleId + '/transactions/' + transactionId + '?query=HTTP Request:', accountId);
        console.log('cycle id = ', cycleId);
        console.log('transaction id = ', transactionId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.lengthOf(2);
    }).timeout(5000);

    /*
    negative tests
    */
});