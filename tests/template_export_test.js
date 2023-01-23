const { expect, get, post } = require('./helper');

let accountId = 'c9199456-20a4-4287-b2bf-d1d4c49fb8fa';

describe("GET and POST template export and import", function () {
    it("export template with template id", async function () {
        const response = await get('/templates/706864ac-e5e3-4196-a06b-bfd62255091b/export', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Name).eq('Pipedrive > GC > Sheets');
    }).timeout(2000);

    /*
    negative tests
    */

    it("import template with no body, expect 400", async function () {
        let bodyData = '';
        const response = await post('/templates/import', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).eq('{"Message":"Failed to import template."}');
    }).timeout(2000);

    it("import template with unknow folder id, expect 400", async function () {
        let bodyData = {};
        const response = await post('/templates/import?folderid=00aaaab0-d8ef-4b2c-b4a8-f109b6ab994d', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).eq('{"Message":"Folder with provided ID could not be found."}');
    }).timeout(2000);

    it("import template with badly formatted template id, expect return 400", async function () {
        let bodyData = {};
        const response = await post('/templates/import?folderid=00ffaab0-d8ef-4b2c-b4a8-f109b6ab454Z', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.text).eq('{"Message":"Folder ID is invalid."}');
    }).timeout(2000);

    it("import template with badly formatted template id which is too long, expect return 400", async function () {
        let bodyData = {};
        const response = await post('/templates/import?folderid=00ffaab0-d8ef-4b2c-b4a8-f109b6ab45XYZ', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.text).eq('{"Message":"Folder ID is invalid."}');
    }).timeout(2000);
});