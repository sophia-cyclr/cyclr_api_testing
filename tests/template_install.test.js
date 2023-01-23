const { expect, post, deletee } = require('./helper');

let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';
let templateId = '';
let bodyData = {};

describe("POST /templates/{id}/install", function () {
    it("installs template into account", async function () {
        const response = await post('/templates/fd949881-00c7-4e56-ad62-992070f9a953/install', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        templateId = response.body.Id;
        expect((response.body.Connectors[0].AccountConnectorId).toString()).to.be.not.empty;
        expect(response.body.Connectors[0].Authenticated).eql(true);
    }).timeout(5000);

    it("deletes template from account", async function () {
        const response = await deletee('/cycles/' + templateId, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("installs template into account, template not found, expect 404", async function () {
        const response = await post('/templates/fd949881-00c7-4e56-ad62-992070f9aaaa/install', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);
});