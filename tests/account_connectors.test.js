const { expect, get, post, put } = require('./helper');

let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';

describe("GET/POST/PUT /account/connectors", function () {
    it("get all installed account connectors", async function () {
        const response = await get('/account/connectors?pageSize=30&page=1', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.lengthOf(30);
        expect(response.body[0].Connector.Icon).to.include('data:image/');
    }).timeout(10000);

    it("get account connector by ID", async function () {
        const response = await get('/account/connectors/1874', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Name).to.eql("MailChimp");
        expect(response.body.Authenticated).to.eql(true);
        expect(response.body.Connector.Status).to.eql('Approved');
        expect(response.body.Connector.Version).to.eql('v3');
        expect(response.body.Connector.Icon).to.include('data:image/');
    }).timeout(5000);

    it("updates account connector", async function () {
        let bodyData = {
            'Description': 'Mailchimp connector in my account'
        };

        const response = await put('/account/connectors/1874', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Description).to.eql('Mailchimp connector in my account');
    }).timeout(5000);

    it("calls a connector trigger", async function () {
        const response1 = await get('/account/connectors/4572', accountId);
        expect(response1.status).to.eql(200);
        expect(response1.header['x-content-type-options']).to.eql('nosniff');

        let bodyData = {};
        const response2 = await post('/account/connectors/4572/triggers/' + response1.body.Connector.Triggers[0].TriggerId, bodyData, accountId);
        expect(response2.status).to.eql(200);
        expect(response2.header['x-content-type-options']).to.eql('nosniff');
        expect(response2.body).to.have.length.greaterThan(0);
        expect(response2.body[0].Value).to.be.not.empty;
    }).timeout(10000);

    it("calls a connector method", async function () {
        const response1 = await get('/connectors/MailChimp/v3/methods?query=List Stores', accountId);
        expect(response1.status).to.eql(200);
        expect(response1.header['x-content-type-options']).to.eql('nosniff');

        const response2 = await get('/account/connectors/1874/methods/' + response1.body[0].MethodUniqueIdentifier, accountId);
        expect(response2.status).to.eql(200);
        expect(response2.header['x-content-type-options']).to.eql('nosniff');
        expect(response2.body.stores[0].name).to.eql('My Store');
    }).timeout(5000);

    it("calls a connector method with parameters", async function () {
        const response1 = await get('/connectors/MailChimp/v3/methods?query=Get Store', accountId);
        expect(response1.status).to.eql(200);
        expect(response1.header['x-content-type-options']).to.eql('nosniff');

        let storeId = response1.body[0].Parameters[0].Id;
        console.log('storeId = ' + storeId);
        let bodyData = `{'Parameters': {${storeId} : 1}}`;

        const response2 = await post('/account/connectors/1874/methods/' + response1.body[0].MethodUniqueIdentifier, bodyData, accountId);
        expect(response2.status).to.eql(200);
        expect(response2.header['x-content-type-options']).to.eql('nosniff');
        expect(response2.body.name).to.eql('My Store');
    }).timeout(5000);

    it("tests a connector", async function () {
        const response1 = await get('/connectors/MailChimp/v3/methods?query=List Stores', accountId);
        expect(response1.status).to.eql(200);
        expect(response1.header['x-content-type-options']).to.eql('nosniff');

        let bodyData = {};
        const response2 = await post('/account/connectors/1874/test/' + response1.body[0].MethodUniqueIdentifier, bodyData, accountId);
        expect(response2.status).to.eql(200);
        expect(response2.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("tests a connector with parameters", async function () {
        const response1 = await get('/connectors/MailChimp/v3/methods?query=Get Store', accountId);
        expect(response1.status).to.eql(200);
        expect(response1.header['x-content-type-options']).to.eql('nosniff');

        let storeId = response1.body[0].Parameters[0].Id;
        let bodyData = `{'Parameters': {${storeId} : 1}}`;
        const response = await post('/account/connectors/1874/test/' + response1.body[0].MethodUniqueIdentifier, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    /*
    negative tests
    */
    it("get account connector by ID, connector not found, return 404", async function () {
        const response = await get('/account/connectors/9999999', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("updates account connector, connector not found, return 404", async function () {
        let bodyData = {
            'Description': 'Mailchimp connector in my account'
        };

        const response = await put('/account/connectors/99999', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("calls a connector trigger, trigger not found, return 404", async function () {
        let bodyData = {};
        const response = await post('/account/connectors/4572/triggers/' + '99999999', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("calls a connector method, method not found, return 404", async function () {
        const response = await get('/account/connectors/1874/methods/999999999', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("calls a connector method with parameters, connector not found, return 404", async function () {
        let bodyData = {
            'Parameters': {
                '296076': 1
            }
        };

        const response = await post('/account/connectors/1874/methods/9999', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("calls a connector method with incorrect parameter, return 400", async function () {
        const response1 = await get('/connectors/MailChimp/v3/methods?query=Get Store', accountId);
        expect(response1.status).to.eql(200);
        expect(response1.header['x-content-type-options']).to.eql('nosniff');
        //console.log('MethodUniqueIdentifier = ' + response1.body[0].MethodUniqueIdentifier);

        let bodyData = {
            'Parameters': {
                '296077': 1
            }
        };

        const response2 = await post('/account/connectors/1874/methods/' + response1.body[0].MethodUniqueIdentifier, bodyData, accountId);
        expect(response2.status).to.eql(400);
        expect(response2.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("calls a connector method with badly formatted method id, return 400", async function () {
        let bodyData = {
            'Parameters': {
                '296077': 1
            }
        };

        const response = await post('/account/connectors/1874/methods/9afbeecc-6019-49c6-ade9-721874d81c5aa', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("tests a connector, connector not found, return 404", async function () {
        let bodyData = {};
        const response = await post('/account/connectors/1874/test/9afbeecc-6019-49c6-ade9-721874d81555', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("tests a connector with badly formatted method id, return 400", async function () {
        let bodyData = {};
        const response2 = await post('/account/connectors/1874/test/9afbeecc-6019-49c6-ade9-721874d81c5aa', bodyData, accountId);
        expect(response2.status).to.eql(400);
        expect(response2.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);
});