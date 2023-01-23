const { expect, get, post, put, deletee } = require('./helper');

let accountId = 'dbcbd15c-efae-4db3-95d2-b0299a3d4ae9'

describe("GET/POST/PUT /accounts", function () {
    it("gets a list of accounts", async function () {
        const response = await get('/accounts?pageSize=100&page=1&sortOrderAsc=true', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');

        //check first few accounts
        for (let i = 0; i < 5; i++) {
            expect(response.body[i].CreatedDate).to.be.not.empty;
            expect(response.body[i].Id).to.be.not.empty;
            expect(response.body[i].Timezone).to.be.not.empty;
        }
    }).timeout(5000);

    it("creates a new account", async function () {
        let bodyData = {
            "Id": "JO-Test-1234567890",
            "Name": "JO-Test-1234567890",
            "Description": "API Created Test Account",
            "Timezone": "Europe/London",
            "AuditInfo": "AuditInfo",
            "TaskAuditInfo": "TaskAuditInfo",
            "StepDataSuccessRetentionHours": 120,
            "StepDataErroredRetentionHours": 60,
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookUrl": "staging.cyclr.com/api/webhook/123",
            "TransactionErrorWebhookIncludeWarnings": true
        };

        const response = await post('/accounts', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.CreatedDate).to.be.not.empty;
        expect(response.body.Id).to.eql('JO-Test-1234567890');
        expect(response.body.Name).to.eql('JO-Test-1234567890');
        expect(response.body.Description).to.eql('API Created Test Account');
        expect(response.body.AuditInfo).to.eql("AuditInfo");
        expect(response.body.TaskAuditInfo).to.eql("TaskAuditInfo");
        expect(response.body.Timezone).to.eql('Europe/London');
        expect(response.body.NextBillDateUtc).to.be.not.empty;
        expect(response.body.StepDataSuccessRetentionHours).to.eql(120);
        expect(response.body.StepDataErroredRetentionHours).to.eql(60);
        expect(response.body.TransactionErrorWebhookEnabled).to.eql(true);
        expect(response.body.TransactionErrorWebhookUrl).to.eql('https://staging.cyclr.com/api/webhook/123');
        expect(response.body.TransactionErrorWebhookIncludeWarnings).to.eql(true);
    }).timeout(5000);

    it("creates a new account, with same Id, expect 400", async function () {
        let bodyData = {
            "Id": "JO-Test-1234567890",
            "Name": "JO-Test-1234567890"
        };

        const response = await post('/accounts', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"ID already in use"}');
    }).timeout(5000);

    it("gets an account by id", async function () {
        response = await get('/accounts/JO-Test-1234567890', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.CreatedDate).to.be.not.empty;
        expect(response.body.Id).to.eql('JO-Test-1234567890');
        expect(response.body.Name).to.eql('JO-Test-1234567890');
        expect(response.body.Description).to.eql('API Created Test Account');
        expect(response.body.AuditInfo).to.eql("AuditInfo");
        expect(response.body.TaskAuditInfo).to.eql("TaskAuditInfo");
        expect(response.body.Timezone).to.eql('Europe/London');
        expect(response.body.NextBillDateUtc).to.be.not.empty;
        expect(response.body.StepDataSuccessRetentionHours).to.eql(120);
        expect(response.body.StepDataErroredRetentionHours).to.eql(60);
        expect(response.body.TransactionErrorWebhookEnabled).to.eql(true);
        expect(response.body.TransactionErrorWebhookUrl).to.eql('https://staging.cyclr.com/api/webhook/123');
        expect(response.body.TransactionErrorWebhookIncludeWarnings).to.eql(true);
    }).timeout(5000);

    it("updates an existing account, change description, retention and webhook url", async function () {
        let bodyData = {
            "Id": "JO-Test-1234567890",
            "Name": "JO-Test-1234567890",
            "Description": "API Created Test Account, modified description",
            "Timezone": "Europe/London",
            "StepDataSuccessRetentionHours": 0,
            "StepDataErroredRetentionHours": null,
            "TransactionErrorWebhookEnabled": false,
            "TransactionErrorWebhookUrl": "https://staging.cyclr.com/api/webhook/1234",
            "TransactionErrorWebhookIncludeWarnings": false
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.CreatedDate).to.be.not.empty;
        expect(response.body.Id).to.eql('JO-Test-1234567890');
        expect(response.body.Name).to.eql('JO-Test-1234567890');
        expect(response.body.Description).to.eql('API Created Test Account, modified description');
        expect(response.body.AuditInfo).to.eql("AuditInfo");
        expect(response.body.TaskAuditInfo).to.eql("TaskAuditInfo");
        expect(response.body.Timezone).to.eql('Europe/London');
        expect(response.body.NextBillDateUtc).to.be.not.empty;
        expect(response.body.StepDataSuccessRetentionHours).to.eql(0);
        expect(response.body.StepDataErroredRetentionHours).to.eql(null);
        expect(response.body.TransactionErrorWebhookEnabled).to.eql(false);
        expect(response.body.TransactionErrorWebhookUrl).to.eql('https://staging.cyclr.com/api/webhook/1234');
        expect(response.body.TransactionErrorWebhookIncludeWarnings).to.eql(false);
    }).timeout(5000);

    it("updates an existing account, change webhook url with no protocol present in url", async function () {
        let bodyData = {
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookUrl": "staging.cyclr.com/api/webhook/12345",
            "TransactionErrorWebhookIncludeWarnings": true
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.CreatedDate).to.be.not.empty;
        expect(response.body.Id).to.eql('JO-Test-1234567890');
        expect(response.body.Name).to.eql('JO-Test-1234567890');
        expect(response.body.Description).to.eql('API Created Test Account, modified description');
        expect(response.body.AuditInfo).to.eql("AuditInfo");
        expect(response.body.TaskAuditInfo).to.eql("TaskAuditInfo");
        expect(response.body.Timezone).to.eql('Europe/London');
        expect(response.body.NextBillDateUtc).to.be.not.empty;
        expect(response.body.StepDataSuccessRetentionHours).to.eql(0);
        expect(response.body.StepDataErroredRetentionHours).to.eql(null);
        expect(response.body.TransactionErrorWebhookEnabled).to.eql(true);
        expect(response.body.TransactionErrorWebhookUrl).to.eql('https://staging.cyclr.com/api/webhook/12345');
        expect(response.body.TransactionErrorWebhookIncludeWarnings).to.eql(true);
    }).timeout(5000);

    it("updates an existing account, set all retention params to null", async function () {
        let bodyData = {
            "StepDataSuccessRetentionHours": null,
            "StepDataErroredRetentionHours": null,
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.CreatedDate).to.be.not.empty;
        expect(response.body.Id).to.eql('JO-Test-1234567890');
        expect(response.body.Name).to.eql('JO-Test-1234567890');
        expect(response.body.Description).to.eql('API Created Test Account, modified description');
        expect(response.body.AuditInfo).to.eql("AuditInfo");
        expect(response.body.TaskAuditInfo).to.eql("TaskAuditInfo");
        expect(response.body.Timezone).to.eql('Europe/London');
        expect(response.body.NextBillDateUtc).to.be.not.empty;
        expect(response.body.StepDataSuccessRetentionHours).to.eql(null);
        expect(response.body.StepDataErroredRetentionHours).to.eql(null);
        expect(response.body.TransactionErrorWebhookEnabled).to.eql(true);
        expect(response.body.TransactionErrorWebhookUrl).to.eql('https://staging.cyclr.com/api/webhook/12345');
        expect(response.body.TransactionErrorWebhookIncludeWarnings).to.eql(true);
    }).timeout(5000);

    it("updates an existing account, required webhook url is null, expect 400", async function () {
        let bodyData = {
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookUrl": null,
            "TransactionErrorWebhookIncludeWarnings": true
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"Transaction Error Webhook enabled: Transaction Error Webhook URL must be defined"}');
    }).timeout(5000);

    it("updates an existing account, required webhook url is empty, expect 400", async function () {
        let bodyData = {
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookUrl": "",
            "TransactionErrorWebhookIncludeWarnings": true
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"Transaction Error Webhook enabled: Transaction Error Webhook URL must be defined"}');
    }).timeout(5000);

    it("updates an existing account, required webhook url param is missing, expect 400", async function () {
        let bodyData = {
            "Name": "JO-Test-1234567890",
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookIncludeWarnings": true
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"Transaction Error Webhook enabled: Transaction Error Webhook URL must be defined"}');
    }).timeout(5000);

    it("updates an existing account, required webhook url is white space, expect 400", async function () {
        let bodyData = {
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookUrl": " ",
            "TransactionErrorWebhookIncludeWarnings": true
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"https://  is not a valid URL"}');
    }).timeout(5000);

    it("updates an existing account, invalid StepDataSuccessRetentionHours (-ve number), expect 400", async function () {
        let bodyData = {
            "Name": "JO-Test-1234567890",
            "StepDataSuccessRetentionHours": -10
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"StepDataSuccessRetentionHours (-10): must be non negative"}');
    }).timeout(5000);

    it("updates an existing account, invalid StepDataErroredRetentionHours (-ve number), expect 400", async function () {
        let bodyData = {
            "StepDataErroredRetentionHours": -10
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"StepDataErroredRetentionHours (-10): must be non negative"}');
    }).timeout(5000);

    it("updates an existing account, invalid StepDataSuccessRetentionHours (string), expect 200, no change in value", async function () {
        let bodyData = {
            "StepDataSuccessRetentionHours": "abc"
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.CreatedDate).to.be.not.empty;
        expect(response.body.Id).to.eql('JO-Test-1234567890');
        expect(response.body.Name).to.eql('JO-Test-1234567890');
        expect(response.body.Description).to.eql('API Created Test Account, modified description');
        expect(response.body.AuditInfo).to.eql("AuditInfo");
        expect(response.body.TaskAuditInfo).to.eql("TaskAuditInfo");
        expect(response.body.Timezone).to.eql('Europe/London');
        expect(response.body.NextBillDateUtc).to.be.not.empty;
        expect(response.body.StepDataSuccessRetentionHours).to.eql(null);
        expect(response.body.StepDataErroredRetentionHours).to.eql(null);
        expect(response.body.TransactionErrorWebhookEnabled).to.eql(true);
        expect(response.body.TransactionErrorWebhookUrl).to.eql('https://staging.cyclr.com/api/webhook/12345');
        expect(response.body.TransactionErrorWebhookIncludeWarnings).to.eql(true);
    }).timeout(5000);

    it("updates an existing account, invalid StepDataErroredRetentionHours (string), expect 200, no change in value", async function () {
        let bodyData = {
            "StepDataErroredRetentionHours": "abc"
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.CreatedDate).to.be.not.empty;
        expect(response.body.Id).to.eql('JO-Test-1234567890');
        expect(response.body.Name).to.eql('JO-Test-1234567890');
        expect(response.body.Description).to.eql('API Created Test Account, modified description');
        expect(response.body.AuditInfo).to.eql("AuditInfo");
        expect(response.body.TaskAuditInfo).to.eql("TaskAuditInfo");
        expect(response.body.Timezone).to.eql('Europe/London');
        expect(response.body.NextBillDateUtc).to.be.not.empty;
        expect(response.body.StepDataSuccessRetentionHours).to.eql(null);
        expect(response.body.StepDataErroredRetentionHours).to.eql(null);
        expect(response.body.TransactionErrorWebhookEnabled).to.eql(true);
        expect(response.body.TransactionErrorWebhookUrl).to.eql('https://staging.cyclr.com/api/webhook/12345');
        expect(response.body.TransactionErrorWebhookIncludeWarnings).to.eql(true);
    }).timeout(5000);

    it("updates an existing account, set all retention params to max values", async function () {
        let bodyData = {
            "StepDataSuccessRetentionHours": 744,
            "StepDataErroredRetentionHours": 744,
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.CreatedDate).to.be.not.empty;
        expect(response.body.Id).to.eql('JO-Test-1234567890');
        expect(response.body.Name).to.eql('JO-Test-1234567890');
        expect(response.body.Description).to.eql('API Created Test Account, modified description');
        expect(response.body.AuditInfo).to.eql("AuditInfo");
        expect(response.body.TaskAuditInfo).to.eql("TaskAuditInfo");
        expect(response.body.Timezone).to.eql('Europe/London');
        expect(response.body.NextBillDateUtc).to.be.not.empty;
        expect(response.body.StepDataSuccessRetentionHours).to.eql(744);
        expect(response.body.StepDataErroredRetentionHours).to.eql(744);
        expect(response.body.TransactionErrorWebhookEnabled).to.eql(true);
        expect(response.body.TransactionErrorWebhookUrl).to.eql('https://staging.cyclr.com/api/webhook/12345');
        expect(response.body.TransactionErrorWebhookIncludeWarnings).to.eql(true);
    }).timeout(5000);

    it("updates an existing account, set retention params to exceed max values", async function () {
        let bodyData = {
            "StepDataSuccessRetentionHours": 745,
            "StepDataErroredRetentionHours": 745,
        };

        response = await put('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.CreatedDate).to.be.not.empty;
        expect(response.body.Id).to.eql('JO-Test-1234567890');
        expect(response.body.Name).to.eql('JO-Test-1234567890');
        expect(response.body.Description).to.eql('API Created Test Account, modified description');
        expect(response.body.AuditInfo).to.eql("AuditInfo");
        expect(response.body.TaskAuditInfo).to.eql("TaskAuditInfo");
        expect(response.body.Timezone).to.eql('Europe/London');
        expect(response.body.NextBillDateUtc).to.be.not.empty;
        expect(response.body.StepDataSuccessRetentionHours).to.eql(744);
        expect(response.body.StepDataErroredRetentionHours).to.eql(744);
        expect(response.body.TransactionErrorWebhookEnabled).to.eql(true);
        expect(response.body.TransactionErrorWebhookUrl).to.eql('https://staging.cyclr.com/api/webhook/12345');
        expect(response.body.TransactionErrorWebhookIncludeWarnings).to.eql(true);
    }).timeout(5000);

    it("deletes an account", async function () {
        let bodyData = {};
        response = await deletee('/accounts/JO-Test-1234567890', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets the sub account for the account", async function () {
        const response = await get('/accounts/54bcef4d-1313-42c8-837a-22c2b11281a0/subaccounts?pageSize=100&page=1&sortOrderAsc=true', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length(0);
    }).timeout(5000);

    it("gets the task usage", async function () {
        const response = await get('/accounts/54bcef4d-1313-42c8-837a-22c2b11281a0/usage', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Id).to.be.not.empty;
        expect((response.body.TasksUsed).toString()).to.be.not.empty;
        expect(response.body.StartTime).to.be.not.empty;
        expect(response.body.EndTime).to.be.not.empty;
    }).timeout(5000);

    /*
    negative tests
    */
    it("creates a new account, invalid StepDataSuccessRetentionHours (-ve number), expect 400", async function () {
        let bodyData = {
            "Id": "JO-Test-1234567890",
            "Name": "JO-Test-1234567890",
            "Description": "API Created Test Account",
            "Timezone": "Europe/London",
            "StepDataSuccessRetentionHours": -10,
            "StepDataErroredRetentionHours": 60,
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookUrl": "https://staging.cyclr.com/api/webhook/123",
            "TransactionErrorWebhookIncludeWarnings": true
        };

        const response = await post('/accounts', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"StepDataSuccessRetentionHours (-10): must be non negative"}');
    }).timeout(5000);

    it("creates a new account, invalid StepDataErroredRetentionHours (-ve number), expect 400", async function () {
        let bodyData = {
            "Id": "JO-Test-1234567890",
            "Name": "JO-Test-1234567890",
            "Description": "API Created Test Account",
            "Timezone": "Europe/London",
            "StepDataSuccessRetentionHours": 10,
            "StepDataErroredRetentionHours": -10,
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookUrl": "https://staging.cyclr.com/api/webhook/123",
            "TransactionErrorWebhookIncludeWarnings": true
        };

        const response = await post('/accounts', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"StepDataErroredRetentionHours (-10): must be non negative"}');
    }).timeout(5000);

    it("creates a new account, required webhook url is empty, expect 400", async function () {
        let bodyData = {
            "Id": "JO-Test-1234567890",
            "Name": "JO-Test-1234567890",
            "Description": "API Created Test Account",
            "Timezone": "Europe/London",
            "StepDataSuccessRetentionHours": 120,
            "StepDataErroredRetentionHours": 60,
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookUrl": "",
            "TransactionErrorWebhookIncludeWarnings": true
        };

        const response = await post('/accounts', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"Transaction Error Webhook enabled: Transaction Error Webhook URL must be defined"}');
    }).timeout(5000);

    it("creates a new account, required webhook is null, expect 400", async function () {
        let bodyData = {
            "Id": "JO-Test-1234567890",
            "Name": "JO-Test-1234567890",
            "Description": "API Created Test Account",
            "Timezone": "Europe/London",
            "StepDataSuccessRetentionHours": 120,
            "StepDataErroredRetentionHours": 60,
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookUrl": null,
            "TransactionErrorWebhookIncludeWarnings": true
        };

        const response = await post('/accounts', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"Transaction Error Webhook enabled: Transaction Error Webhook URL must be defined"}');
    }).timeout(5000);

    it("creates a new account, required webhook is white space, expect 400", async function () {
        let bodyData = {
            "Id": "JO-Test-1234567890",
            "Name": "JO-Test-1234567890",
            "Description": "API Created Test Account",
            "Timezone": "Europe/London",
            "StepDataSuccessRetentionHours": 120,
            "StepDataErroredRetentionHours": 60,
            "TransactionErrorWebhookEnabled": true,
            "TransactionErrorWebhookUrl": "    ",
            "TransactionErrorWebhookIncludeWarnings": true
        };

        const response = await post('/accounts', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.eql('{"Message":"https://     is not a valid URL"}');
    }).timeout(5000);

    it("gets an account by id, id not found, return 404", async function () {
        response = await get('/accounts/JO-Test-987654321', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("deletes account, id not found, return 404", async function () {
        let bodyData = {};
        response = await deletee('/accounts/JO-Test-xyz123', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets the sub account for the account, id not found, return 404", async function () {
        const response = await get('/accounts/11111111-1313-42c8-837a-22c2b11281a0/subaccounts?pageSize=100&page=1&sortOrderAsc=true', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets the task usage, id not found, return 404", async function () {
        const response = await get('/accounts/11111111-1313-42c8-837a-22c2b11281a0/usage', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("create account with no name, expect 400", async function () {
        let bodyData = {
            "description": "SD-1932",
            "AuditInfo": "testAuditInfo",
            "TaskAuditInfo": "testAuditInfo",
            "NextBillDateUtc": "2023-04-19T09:00:23.601Z"
        };

        const response = await post('/accounts', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.contains('Name is required');
    }).timeout(5000);

    it("create account with empty name, expect 400", async function () {
        let bodyData = {
            "description": "SD-1932",
            "Name": "",
            "AuditInfo": "testAuditInfo",
            "TaskAuditInfo": "testAuditInfo",
            "NextBillDateUtc": "2023-04-19T09:00:23.601Z"
        };

        const response = await post('/accounts', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.text).to.contains('Name is required');
    }).timeout(5000);
});
