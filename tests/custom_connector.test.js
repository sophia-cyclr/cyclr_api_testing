const { expect, post, get, deletee } = require('./helper');

let endPoint = '/account/connectors/custom/';
let accountId = 'c9199456-20a4-4287-b2bf-d1d4c49fb8fa';
let id;
let name;

describe("GET/POST/DELETE /account/connectors/custom", function () {
    it("creates a custom connector", async function () {
        let bodyData = {
            "ProductAddon": {
                "Categories": [],
                "ConnectorName": "CPT-132-DeleteMe",
                "Currency": "USD",
                "Published": false,
                "CreatedOnUtc": "2022-08-03T12:58:29",
                "UpdatedOnUtc": "2022-08-03T12:58:29"
            },
            "Authentication": [
                {
                    "IsDefault": true
                }
            ],
            "Parameters": [],
            "Triggers": [],
            "MethodCategories": [],
            "Methods": [],
            "RateLimits": [],
            "Deprecations": [],
            "CreatedOnUtc": "2022-08-03T12:58:29",
            "Status": "Approved",
            "ReleaseStatus": "Draft",
            "UniqueIdentifier": "c789edf8-f288-45c2-8cf9-236f5c4f472d",
            "Billable": true,
            "Name": "CPT-132-DeleteMe"
        }

        const response = await post(endPoint, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Name).is.not.empty;

        id = response.body.Id;
        name = response.body.Name
    }).timeout(5000);

    it("get a list of custom connectors", async function () {
        const response = await get(endPoint, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).has.lengthOf(1);
        expect(response.body[0].Id).eql(id);
        expect(response.body[0].Name).eql(name);
    }).timeout(5000);

    /*//FAILING with JSON response parsing error?
    it("get a custom connector with id", async function () {
        const response = await get(endPoint + id, accountId)
        expect(response.status).to.eql(200);
        expect(response.body.Name).eql(name);
        console.log(response.body.Name)
    }).timeout(5000);
    */
    

    it("delete a custom connector with id", async function () {
        let bodyData = {};
        const response = await deletee(endPoint + id, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("get a list of custom connectors, expect none", async function () {
        const response = await get(endPoint, accountId)
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).has.lengthOf(0);
    }).timeout(5000);

    /*
    Negative Tests
    */

    it("creates a custom connector, no account id provided, expect 401", async function () {
        let bodyData = {
            "ProductAddon": {
                "Categories": [],
                "ConnectorName": "CPT-132-DeleteMe",
                "Currency": "USD",
                "Published": false,
                "CreatedOnUtc": "2022-08-03T12:58:29",
                "UpdatedOnUtc": "2022-08-03T12:58:29"
            },
            "Authentication": [
                {
                    "IsDefault": true
                }
            ],
            "Parameters": [],
            "Triggers": [],
            "MethodCategories": [],
            "Methods": [],
            "RateLimits": [],
            "Deprecations": [],
            "CreatedOnUtc": "2022-08-03T12:58:29",
            "Status": "Approved",
            "ReleaseStatus": "Draft",
            "UniqueIdentifier": "c789edf8-f288-45c2-8cf9-236f5c4f472d",
            "Billable": true,
            "Name": "CPT-132-DeleteMe"
        }

        const response = await post(endPoint, bodyData, "");
        expect(response.status).to.eql(401);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("creates a custom connector, no UniqueIdentifier value provided , expect 400", async function () {
        let bodyData = {
            "ProductAddon": {
                "Categories": [],
                "ConnectorName": "CPT-132-DeleteMe",
                "Currency": "USD",
                "Published": false,
                "CreatedOnUtc": "2022-08-03T12:58:29",
                "UpdatedOnUtc": "2022-08-03T12:58:29"
            },
            "Authentication": [
                {
                    "IsDefault": true
                }
            ],
            "Parameters": [],
            "Triggers": [],
            "MethodCategories": [],
            "Methods": [],
            "RateLimits": [],
            "Deprecations": [],
            "CreatedOnUtc": "2022-08-03T12:58:29",
            "Status": "Approved",
            "ReleaseStatus": "Draft",
            "UniqueIdentifier": "",
            "Billable": true,
            "Name": "CPT-132-DeleteMe"
        }

        const response = await post(endPoint, bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("creates a custom connector, invalid UniqueIdentifier value provided , expect 400", async function () {
        let bodyData = {
            "ProductAddon": {
                "Categories": [],
                "ConnectorName": "CPT-132-DeleteMe",
                "Currency": "USD",
                "Published": false,
                "CreatedOnUtc": "2022-08-03T12:58:29",
                "UpdatedOnUtc": "2022-08-03T12:58:29"
            },
            "Authentication": [
                {
                    "IsDefault": true
                }
            ],
            "Parameters": [],
            "Triggers": [],
            "MethodCategories": [],
            "Methods": [],
            "RateLimits": [],
            "Deprecations": [],
            "CreatedOnUtc": "2022-08-03T12:58:29",
            "Status": "Approved",
            "ReleaseStatus": "Draft",
            "UniqueIdentifier": "123",
            "Billable": true,
            "Name": "CPT-132-DeleteMe"
        }

        const response = await post(endPoint, bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("creates a custom connector, no JSON definition provided, expect 400", async function () {
        const response = await post(endPoint, "", accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("creates a custom connector, empty JSON definition provided, expect 400", async function () {
        let bodyData = {};
        const response = await post(endPoint, bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("creates a custom connector, no name field provided, expect 400", async function () {
        let bodyData = {
            "ProductAddon": {
                "Categories": [],
                "ConnectorName": "CPT-132-DeleteMe",
                "Currency": "USD",
                "Published": false,
                "CreatedOnUtc": "2022-08-03T12:58:29",
                "UpdatedOnUtc": "2022-08-03T12:58:29"
            },
            "Authentication": [
                {
                    "IsDefault": true
                }
            ],
            "Parameters": [],
            "Triggers": [],
            "MethodCategories": [],
            "Methods": [],
            "RateLimits": [],
            "Deprecations": [],
            "CreatedOnUtc": "2022-08-03T12:58:29",
            "Status": "Approved",
            "ReleaseStatus": "Draft",
            "UniqueIdentifier": "c789edf8-f288-45c2-8cf9-236f5c4f472d",
            "Billable": true,
        }

        const response = await post(endPoint, bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"Invalid connector: (Column \'Name\' cannot be null)"}');
    }).timeout(5000);

    it("get a custom connector with invalid id, expect 404", async function () {
        const response = await get(endPoint + '1234567', accountId)
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("delete a custom connector with invalid id, expect 404", async function () {
        let bodyData = {};
        const response = await deletee(endPoint + '1234567', bodyData, accountId)
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);
});
