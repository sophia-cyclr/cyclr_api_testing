const { expect, get, post, deletee } = require('./helper');

let edgeId = '';
let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';

describe("GET /edges", function () {
    it("gets all edges for a cycles", async function () {
        const response = await get('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/edges', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Id).is.not.empty;
        expect(response.body[0].HeadStepId).is.not.empty;
        expect(response.body[0].TailStepId).is.not.empty;
        expect(response.body[0].EdgeType).is.not.empty;
        edgeId = response.body[0].Id;
    }).timeout(5000);

    it("gets an edge from the cycles", async function () {
        const response = await get('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/edges/' + edgeId, accountId);
        expect(response.status).to.eql(200);
        expect(response.body.Id).is.not.empty;
        expect(response.body.HeadStepId).is.not.empty;
        expect(response.body.TailStepId).is.not.empty;
        expect(response.body.EdgeType).is.not.empty;
    }).timeout(5000);

    /*
    negative tests
    */
    it("gets an edge from the cycles, id not found, return 404", async function () {
        const response = await get('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/edges/' + edgeId, accountId)
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("adds an edge to the cycles, cycle id not found, return 404", async function () {
        let bodyData = {
            "Id": "00000000-0000-0000-0000-000000000000",
            "HeadStepId": "00000000-0000-0000-0000-000000000000",
            "TailStepId": "00000000-0000-0000-0000-000000000000",
            "EdgeType": "Forward"
        };

        const response = await post('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/edges/', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("deletes an edge from the cycles, cycle id not found, return 404", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/edges/' + edgeId, bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);
});