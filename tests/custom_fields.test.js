const { expect, get, put, post, deletee } = require('./helper');

let fieldId = '';
let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';

describe("GET /account/connectors/{accountConnectorId}/fields", function () {
    it("creates a custom field", async function () {
        let bodyData = {
            "ConnectorField": "ListAllMyBucketsResult.Buckets.[Bucket].TempCustomField",
            "SystemField": null,
            "DisplayName": "TempCustomField",
            "Description": "My TempCustomField, delete me",
            "DataType": "Text",
            "MethodUniqueIdentifier": "00000000-0000-0000-0000-000000000000",
            "DataTypeFormat": null,
            "EntityIdentifier": null,
            "ForRequestFormat": false
        };

        const response = await post('/account/connectors/6994/fields', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Id).to.be.not.null;
        expect(response.body.ConnectorField).eql("ListAllMyBucketsResult.Buckets.[Bucket].TempCustomField");
        expect(response.body.Description).eql("My TempCustomField, delete me");
        expect(response.body.DataType).eql("Text");
        expect(response.body.MethodUniqueIdentifier).eql("00000000-0000-0000-0000-000000000000");
        expect(response.body.ForRequestFormat).eql(false);
        fieldId = response.body.Id;
    }).timeout(5000);

    it("changes a custom field", async function () {
        let bodyData = {
            "ConnectorField": "ListAllMyBucketsResult.Buckets.[Bucket].TempCustomField",
            "SystemField": null,
            "DisplayName": "TempCustomField",
            "Description": "Changed description, My TempCustomField, delete me soon",
            "DataType": "Text",
            "MethodUniqueIdentifier": "00000000-0000-0000-0000-000000000000",
            "DataTypeFormat": null,
            "EntityIdentifier": null,
            "ForRequestFormat": false
        };

        const response = await put('/account/connectors/6994/fields/' + fieldId, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Id).to.be.not.null;
        expect(response.body.ConnectorField).eql("ListAllMyBucketsResult.Buckets.[Bucket].TempCustomField");
        expect(response.body.Description).eql("Changed description, My TempCustomField, delete me soon");
        expect(response.body.DataType).eql("Text");
        expect(response.body.MethodUniqueIdentifier).eql("00000000-0000-0000-0000-000000000000");
        expect(response.body.ForRequestFormat).eql(false);
    }).timeout(5000);

    it("gets a custom field", async function () {
        const response = await get('/account/connectors/6994/fields/' + fieldId, accountId);
        expect(response.status).to.eql(200);
        expect(response.body.Id).to.be.not.null;
        expect(response.body.ConnectorField).eql("ListAllMyBucketsResult.Buckets.[Bucket].TempCustomField");
        expect(response.body.Description).eql("Changed description, My TempCustomField, delete me soon");
        expect(response.body.DataType).eql("Text");
        expect(response.body.MethodUniqueIdentifier).eql("00000000-0000-0000-0000-000000000000");
        expect(response.body.ForRequestFormat).eql(false);
    }).timeout(5000);

    it("deletes a custom field", async function () {
        let bodyData = {};
        const response = await deletee('/account/connectors/6994/fields/' + fieldId, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets a deleted custom field", async function () {
        const response = await get('/account/connectors/6994/fields', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length(0);
    }).timeout(5000);
});
