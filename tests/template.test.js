const { get, expect, getToken } = require('./helper');
let accountId = 'bcadc010-66b9-45cf-9bf2-4357619de359';

describe("GET /templates/id", function () {
    it("get template with template id", async function () {
        const response = await get('/templates/fd949881-00c7-4e56-ad62-992070f9a953/', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Connectors[0].Name).eq('MailChimp');
        expect(response.body.Connectors[0].Version).eq('v3');
        expect(response.body.Tags[0]).eq('jotest1');
    }).timeout(5000);

    /*
    negative tests
    */

    it("get template with template id, id not found, return 404", async function () {
        const response = await get('/templates/fd949881-00c7-4e56-ad62-992070f99999/', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);
});