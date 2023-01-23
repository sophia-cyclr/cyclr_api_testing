const { expect, get, post, put  } = require('./helper');

//createAccountStepId is in folder backup API-Step-Test
const createAccountStepId = '08da7c4e-1775-4112-8d06-42dc6982d801'
const getLeadStepId = '08d95c0d-a7e7-43df-826a-a76f8719d749'
let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';
let accountNameFieldId = '';
let paramId = '';
let triggerId = '';

describe("Get /steps/id", function () {
    it("gets step setup prerequisites", async function () {
        const response = await get('/steps/' + createAccountStepId + '/prerequisites', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets fields from previous steps that can be used in field mapping", async function () {
        const response = await get('/steps/' + createAccountStepId + '/fieldsformapping', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length.greaterThan(0);
    }).timeout(10000);

    it("gets step field mappings", async function () {
        const response = await get('/steps/' + createAccountStepId + '/fieldmappings', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length.greaterThan(1);
        expect(response.body[0].Field.Name).eql('Account Name');
        accountNameFieldId = response.body[0].Field.Id;
        console.log("accountNameFieldId " + accountNameFieldId);
    }).timeout(5000);

    it("gets step field mappings with field id", async function () {
        const response = await get('/steps/' + createAccountStepId + '/fieldmappings/' + accountNameFieldId, accountId);
        expect(response.status).to.eql(200);
        expect(response.body.Field.Name).eql('Account Name');
    }).timeout(5000);

    it("updates a step field mapping", async function () {
        let bodyData = {
            "Field": {
                "Id": accountNameFieldId,
                "ForRequestFormat": true
            },
            "MappingType": "StaticValue",
            "IsLaunchVisible": false,
            "Value": "johntest"
        };

        const response = await put('/steps/' + createAccountStepId + '/fieldmappings/' + accountNameFieldId, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Field.Id).eql(accountNameFieldId);
        expect(response.body.Field.Name).eql('Account Name');
        expect(response.body.MappingType).eql('StaticValue');
        expect(response.body.IsLaunchVisible).eql(false);
        expect(response.body.Value).eql('johntest');
    }).timeout(5000);

    it("gets step parameter mapping", async function () {
        const response = await get('/steps/' + getLeadStepId + '/parameters', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length.greaterThan(0);
        paramId = response.body[0].Parameter.Id;
        triggerId = response.body[0].Parameter.Triggers[0].TriggerId;
        console.log('triggerId =' + triggerId);
        console.log('paramId =' + triggerId);
    }).timeout(5000);

    it("updates a step parameter mapping", async function () {
        let bodyData = {
            "MappingType": "StaticValue"
        };

        const response = await put('/steps/' + getLeadStepId + '/parameters/' + paramId, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.MappingType).eql('StaticValue');
    }).timeout(5000);

    it("triggers a parameter lookup", async function () {
        let bodyData = {
            "TriggerId": triggerId
        };

        const response = await post('/steps/' + getLeadStepId + '/parameters/' + paramId + '/lookup', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length.greaterThan(0);
        expect(response.body[0].Name).to.be.not.empty;
        expect(response.body[0].Value).to.be.not.empty;
    }).timeout(5000);

    it("start custom field lookup for the method request and response", async function () {
        let bodyData = {};
        const response = await post('/steps/' + getLeadStepId + '/fieldmappings/' + 'lookup', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    /*
    negative tests
    */
    it("gets step setup prerequisites, id not found, return 404", async function () {
        const response = await get('/steps/11111111-1f32-4bd7-8904-dddfddbec266/prerequisites', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets fields from previous steps used in field mapping, id not found, return 404", async function () {
        const response = await get('/steps/11111111-1f32-4bd7-8904-dddfddbec266/fieldsformapping', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(10000);

    it("gets step field mappings, id not found, return 404", async function () {
        const response = await get('/steps/11111111-1f32-4bd7-8904-dddfddbec266/fieldmappings', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets step field mappings with field id, field id not found, return 404", async function () {
        const response = await get('/steps/' + createAccountStepId + '/fieldmappings/123', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets step field mappings with field id, step id badly formatted, return 400", async function () {
        const response = await get('/steps/X8d9a2ab-1f32-4bd7-8904-dddfddbec266/fieldmappings/123', accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("updates a step field mapping, field id badly formatted, return 400", async function () {
        let bodyData = {
            "Field": {
                "Id": 'XXX',
                "ForRequestFormat": true
            },
            "MappingType": "StaticValue",
            "IsLaunchVisible": false,
            "Value": "johntest"
        };

        const response = await put('/steps/' + createAccountStepId + '/fieldmappings/XXX', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("updates a step field mapping, field id not found, return 404", async function () {
        let bodyData = {
            "Field": {
                "Id": 1234,
                "ForRequestFormat": true
            },
            "MappingType": "StaticValue",
            "IsLaunchVisible": false,
            "Value": "johntest"
        };

        const response = await put('/steps/' + createAccountStepId + '/fieldmappings/1234', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("triggers a parameter lookup, parameter not found, return 404", async function () {
        let bodyData = {
            "TriggerId": triggerId
        };

        const response = await post('/steps/' + '08d95c0d-a7e7-43df-826a-a76f8719d749' + '/parameters/' + '123' + '/lookup', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("triggers a parameter lookup, trigger id not found, return 404", async function () {
        let bodyData = {
            "TriggerId": '123'
        };

        const response = await post('/steps/' + getLeadStepId + '/parameters/' + paramId + '/lookup', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);
});
