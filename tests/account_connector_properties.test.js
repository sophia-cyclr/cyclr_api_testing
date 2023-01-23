const { expect, post, get, put, deletee } = require('./helper');

let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';
let propertyId = '';

describe("GET/POST/PUT/DELETE /account/connectors/id/properties", function () {
    it("get account connector properties", async function () {
        const response = await get('/account/connectors/5487/properties?sortOrderAsc=true&orderBy=Name', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Name).to.eql('FtpEncryptedDataChannel');

    }).timeout(5000);

    it("create account connector property", async function () {
        let bodyData = {
            'Name': 'JO-Test-Prop',
            'Value': 'ABC-1234',
            'Id': 0
        };

        const response = await post('/account/connectors/6508/properties', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Name).to.eql('JO-Test-Prop');
        expect(response.body.Value).to.eql('ABC-1234');
        expect((response.body.Id).toString()).to.be.not.empty;
        expect(response.body.AccountConnectorId).to.eql(6508);
        propertyId = response.body.Id;
    });

    //get the property
    it("get account connector property", async function () {
        const response = await get('/account/connectors/6508/properties/' + propertyId, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Name).to.eql('JO-Test-Prop');
        expect(response.body.Value).to.eql('ABC-1234');
        expect(response.body.Id).to.eql(propertyId);
        expect(response.body.AccountConnectorId).to.eql(6508);
    });

    //change the property value
    it("modify account connector property", async function () {
        let bodyData = {
            'Name': 'JO-Test-Prop',
            'Value': 'ABC-4321',
            'Id': 0
        };

        const response = await put('/account/connectors/6508/properties/' + propertyId, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Name).to.eql('JO-Test-Prop');
        expect(response.body.Value).to.eql('ABC-4321');
        expect(response.body.Id).to.eql(propertyId);
        expect(response.body.AccountConnectorId).to.eql(6508);
    });

    //delete the property
    it("delete account connector property", async function () {
        let bodyData = {};
        const response = await deletee('/account/connectors/6508/properties/' + propertyId, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    /*
    negative tests
    */
    it("get account connector properties, connector not found, return 404", async function () {
        const response = await get('/account/connectors/5487123/properties?sortOrderAsc=true&orderBy=Name', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("get account connector property, property not found, return 404", async function () {
        const response = await get('/account/connectors/6508/properties/12345', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    });

    it("modify account connector property, property not found, return 404", async function () {
        let bodyData = {
            'Name': 'JO-Test-Prop',
            'Value': 'ABC-4321',
            'Id': 0
        };

        const response = await put('/account/connectors/6508/properties/123456', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    });

    it("delete account connector property, property not found, return 404", async function () {
        let bodyData = {};
        const response = await deletee('/account/connectors/6508/properties/654321', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);
});
