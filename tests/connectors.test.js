const { expect, get, post, deletee, put } = require('./helper');

let connectorId = '';
let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';
let accountId2 = 'c9199456-20a4-4287-b2bf-d1d4c49fb8fa';

describe("GET/POST/PUT/DELETE /connectors", function () {
    it("get a list of connectors", async function () {
        const response = await get('/connectors?pageSize=30&orderBy=Name&sortOrderAsc=true&includeCustomConnectors=true', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).has.lengthOf(30);
    }).timeout(10000);

    it("get a connector with name query and exclude custom connectors", async function () {
        const response = await get('/connectors?query=MailChimp&includeCustomConnectors=false', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).has.lengthOf(1);
        expect(response.body[0].Name).eql('MailChimp');
    }).timeout(10000);

    it("get a list of connectors with category filter", async function () {
        const response = await get('/connectors?category=CRMs&pageSize=3&page=2', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).has.lengthOf(3);
        expect(response.body[0].Categories).to.include('CRMs');
        expect(response.body[1].Categories).to.include('CRMs');
        expect(response.body[2].Categories).to.include('CRMs');
    }).timeout(10000);

    it("get a list of connectors with category filter and name query", async function () {
        const response = await get('/connectors?category=CRMs&query=MailChimp&includeCustomConnectors=false', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Name).eql('MailChimp');
        expect(response.body[0].Categories).to.include('CRMs');
    }).timeout(10000);

    it("get a connector by name", async function () {
        const response = await get('/connectors/Access CRM', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Name).eq('Access CRM');
    }).timeout(5000);

    it("get a connector by name and version", async function () {
        const response = await get('/connectors/MailChimp/v3', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Name).eq('MailChimp');
        connectorId = response.body[0].Id;
    }).timeout(5000);

    it("get a connector by id", async function () {
        const response = await get('/connectors/' + connectorId, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Name).eq('MailChimp');
        console.log('connector id = ' + connectorId);
    }).timeout(5000);

    it("get methods for the connector by connector id", async function () {
        const response = await get('/connectors/' + connectorId + '/methods', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).has.length.gt(0);
        expect(response.body[0].Name).is.not.empty;
    }).timeout(10000);

    it("get methods for the connector by connector id and category filter", async function () {
        const response = await get('/connectors/' + connectorId + '/methods/' + '?category=eCommerce Customers', accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).has.length.gt(0);
        expect(response.body[0].Category).eq('eCommerce Customers');
        expect(response.body[1].Category).eq('eCommerce Customers');
        expect(response.body[2].Category).eq('eCommerce Customers');
        expect(response.body[3].Category).eq('eCommerce Customers');
        expect(response.body[4].Category).eq('eCommerce Customers');

        expect(response.body[0].Name).eq('Add Customer');
        expect(response.body[1].Name).eq('Delete Customer');
        expect(response.body[2].Name).eq('Get Customer');
        expect(response.body[3].Name).eq('List Customers');
        expect(response.body[4].Name).eq('Update Customer');
    }).timeout(10000);

    it("get methods for the connector by connector id and query", async function () {
        const response = await get('/connectors/' + connectorId + '/methods/' + '?&query=Add Customer', accountId)
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Name).eq('Add Customer');
    }).timeout(10000);

    it("get methods for the connector by connector id with category and query", async function () {
        const response = await get('/connectors/' + connectorId + '/methods/' + '?category=eCommerce Customers&query=Add Customer', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Category).eq('eCommerce Customers');
        expect(response.body[0].Name).eq('Add Customer');
    }).timeout(10000);

    it("get methods for the connector by connector name", async function () {
        const response = await get('/connectors/MailChimp/v3/methods', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).has.length.gt(0);
        expect(response.body[0].Name).is.not.empty;
    }).timeout(10000);

    it("get methods for the connector by connector name and category filter", async function () {
        const response = await get('/connectors/MailChimp/v3/methods?category=eCommerce Customers', accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).has.length.gt(0);
        expect(response.body[0].Category).eq('eCommerce Customers');
        expect(response.body[1].Category).eq('eCommerce Customers');
        expect(response.body[2].Category).eq('eCommerce Customers');
        expect(response.body[3].Category).eq('eCommerce Customers');
        expect(response.body[4].Category).eq('eCommerce Customers');

        expect(response.body[0].Name).eq('Add Customer');
        expect(response.body[1].Name).eq('Delete Customer');
        expect(response.body[2].Name).eq('Get Customer');
        expect(response.body[3].Name).eq('List Customers');
        expect(response.body[4].Name).eq('Update Customer');
    }).timeout(10000);

    it("get methods for the connector by connector name and method name query", async function () {
        const response = await get('/connectors/MailChimp/v3/methods?&query=Add Customer', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Name).eq('Add Customer');
    }).timeout(10000);

    it("get methods for the connector by connector name with method category and query", async function () {
        const response = await get('/connectors/MailChimp/v3/methods?category=eCommerce Customers&query=Add Customer', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Category).eq('eCommerce Customers');
        expect(response.body[0].Name).eq('Add Customer');
    }).timeout(10000);



    it("installs a connector with connector name", async function () {
        let bodyData = {
            "AuthValue": "S3B2NjFybDNnSHFNZnV5NnZmMC9UeWtWODhEUVUzbHJtZXI1V2htcHJld3JsRUoyVkdYMjFoUjB5S1NaeTNPc252ZzVaS1Y1c00zaVJiMEh4T05FWVdoM3hLRVpZQUxya1RKSXZudmJ4bHllZzBpS2l2RmRHQkpDMEY3S0psblkrR29ZV1hFYTExU3hWYkpjN2VGOEkvK3VydlpkU1hjbTRMTHZwczg5MnR5SDlRY3hnaGd3VzMreEttMjZPOVorZm1ZL3dmYzhtd0w5dU0zYlBoQjNKZz09",
            "Properties": [
                {
                    "Name": "integratorKey",
                    "Value": "76e7d14f-0c7f-437c-92b3-2dfd5338acc6",
                    "Id": 0
                }
            ]
        };

        const response = await post('/connectors/Access CRM/install', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Authenticated).eql(true);
        expect(response.body.Connector.Name).eql('Access CRM');
        connectorId = response.body.Id;
        console.log('connectorId ', connectorId);
    }).timeout(10000);

    it("deauthenticates a connector", async function () {
        let bodyData = {};
        const response = await put('/account/connectors/' + connectorId + '/deauthenticate', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Message).to.eql('Connector \'Access CRM\' successfully de-authenticated.');
    }).timeout(5000);

    it("deletes a connector", async function () {
        let bodyData = {};
        const response = await deletee('/account/connectors/' + connectorId, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);


    it("installs a connector with connector id", async function () {
        let response = await get('/connectors/Access CRM', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Name).eq('Access CRM');
        connectorId = response.body[0].Id;

        let bodyData = {
            "AuthValue": "S3B2NjFybDNnSHFNZnV5NnZmMC9UeWtWODhEUVUzbHJtZXI1V2htcHJld3JsRUoyVkdYMjFoUjB5S1NaeTNPc252ZzVaS1Y1c00zaVJiMEh4T05FWVdoM3hLRVpZQUxya1RKSXZudmJ4bHllZzBpS2l2RmRHQkpDMEY3S0psblkrR29ZV1hFYTExU3hWYkpjN2VGOEkvK3VydlpkU1hjbTRMTHZwczg5MnR5SDlRY3hnaGd3VzMreEttMjZPOVorZm1ZL3dmYzhtd0w5dU0zYlBoQjNKZz09",
            "Properties": [
                {
                    "Name": "integratorKey",
                    "Value": "76e7d14f-0c7f-437c-92b3-2dfd5338acc6",
                    "Id": 0
                }
            ]
        };

        response = await post('/connectors/' + connectorId + '/install', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Authenticated).eql(true);
        expect(response.body.Connector.Name).eql('Access CRM');
        connectorId = response.body.Id;
    }).timeout(10000);

    it("deletes a connector", async function () {
        let bodyData = {};
        const response = await deletee('/account/connectors/' + connectorId, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    /*
    Negative Tests
    */

    it("installs connector with parameter that doesn't exist, expect 400 response", async function () {
        let response = await get('/connectors?query=Generic Webhook&includeCustomConnectors=false', accountId2);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Name).eql('Generic Webhook');
        connectorId = response.body[0].Id;

        let bodyData = {
            "Name": "Generic Webhook",
            "Properties": [
                {
                    "Name": "Dont exist",
                    "Value": "TestString_viaAPI"
                }
            ]
        };

        response = await post('/connectors/' + connectorId + '/install', bodyData, accountId2);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"There is not a connector property that matches name \'Dont exist\'."}');
    }).timeout(5000);

    it("installs connector with parameter that isn't an account property, expect 400 response", async function () {
        let response = await get('/connectors?query=Generic Webhook&includeCustomConnectors=false', accountId2);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Name).eql('Generic Webhook');
        connectorId = response.body[0].Id;

        let bodyData = {
            "Name": "Generic Webhook",
            "Properties": [
                {
                    "Name": "EndpointUrl",
                    "Value": "TestString_viaAPI"
                }
            ]
        };

        response = await post('/connectors/' + connectorId + '/install', bodyData, accountId2);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"Connector property name \'EndpointUrl\' is not an account connector property."}');
    }).timeout(5000);

    it("installs a draft connector, expect 400 response", async function () {
        let bodyData = {};
        response = await post('/connectors/5122/install', bodyData, accountId2);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"Connector 5122 is a draft and cannot be installed."}');
    }).timeout(5000);

    /*
    it("installs a connector with connector id but no body, expect 400/500?", async function () {
        let response = await get('/connectors/Access CRM', accountId);
        expect(response.status).to.eql(200);
        expect(response.body[0].Name).eq('Access CRM');
        connectorId = response.body[0].Id;
        response = await post('/connectors/' + connectorId + '/install', null, accountId);
        expect(response.status).to.eql(500); //Needs a fix to change 500
    }).timeout(10000);
    */
});
