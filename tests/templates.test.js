const { expect, get } = require('./helper');
let accountId = 'bcadc010-66b9-45cf-9bf2-4357619de359';


describe("GET /templates", function () {
    it("gets all templates", async function () {
        const response = await get("/templates?sortOrderAsc=false&pageSize=5&page=1&orderBy=Id", accountId)
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.lengthOf(5);

    }).timeout(5000);;

    it("gets all templates for specified page", async function () {
        const response = await get("/templates?pageSize=100&page=10", accountId);
        expect(response.body).to.have.length(0);
        expect(response.status).to.eql(200);

    }).timeout(5000);

    it("gets all templates with specific tag", async function () {
        const response = await get("/templates?page=1&tag=jotest1", accountId);
        expect(response.status).to.eql(200);
        expect(response.body).to.have.length(1);
        expect(response.body[0].Name).eq('Regression Template For Launch');

    }).timeout(5000);

    it("gets all templates with specified connector and icon data", async function () {
        const response = await get("/templates?connectorName=MailChimp&connectorVersion=v3&includeIcons=true", accountId);
        expect(response.status).to.eql(200);
        expect(response.body[0].Connectors[0].Name).eq('MailChimp');
        expect(response.body[0].Connectors[0].Version).eq('v3');
        expect(response.body[0].Connectors[0].Icon).to.include('data:image/png;base64');

    }).timeout(5000);

    it("gets all templates with custom data", async function () {
        const response = await get("/templates?lookupCustomFields=true&includePrerequisites=true&includeOptional=true", accountId);
        expect(response.status).to.eql(200);

    }).timeout(15000);
});
