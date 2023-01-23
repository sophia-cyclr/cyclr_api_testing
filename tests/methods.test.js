const { expect, get } = require('./helper');

let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';

describe("GET /methods", function () {
    it("gets a method by Id", async function () {
        let response = await get('/connectors', accountId);
        expect(response.status).to.eql(200);
        let connectorId = response.body[0].Id;

        response = await get('/connectors/' + connectorId + '/methods', accountId);
        expect(response.status).to.eql(200);
        let methodId = response.body[0].Id;

        response = await get('/methods/' + methodId, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Name).is.not.empty;
        expect(response.body.Description).is.not.empty;
        expect(response.body.Category).is.not.empty;
        expect(response.body.MethodType).is.not.empty;
        expect(response.body.EndPoint).is.not.empty;
    }).timeout(10000);

    /*
    negative tests
    */
    it("gets a method by id, id not found, return 404", async function () {
        const response = await get('/connectors/1234', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(10000);
});
