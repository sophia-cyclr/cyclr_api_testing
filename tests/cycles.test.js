const { expect, get, post, deletee, put, patch } = require('./helper');

let cycleId = '';
let stepId = '';
let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';

describe("GET /cycles", function () {
    it("gets a list of cycles", async function () {
        const response = await get('/cycles?pageSize=10&page=1&orderBy=Id&sortOrderAsc=true&includeIcons=true', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.lengthOf(10);
        expect(response.body[0].Connectors[0].Icon).to.include('data:image/png;base64');
    }).timeout(5000);

    it("gets a list of cycles with connector name and version query", async function () {
        const response = await get('/cycles?connectorName=MailChimp&connectorVersion=v3&includeIcons=false', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].Connectors[0].Icon).eql(null);
        expect(response.body[0].Connectors[1].Name).to.eql('MailChimp');
    }).timeout(5000);

    it("gets a list of cycles with tag query", async function () {
        const response = await get('/cycles?tag=backup_1', accountId);
        expect(response.status).to.eql(200);
        expect(response.body).to.have.lengthOf(1);
    }).timeout(5000);

    it("creates a cycle", async function () {
        let bodyData = {
            "Name": "API Create Test Cycle",
            "Description": "Create cycle with API",
            "Shareable": true,
            "StepErrorAction": 'Ignore',
            "LogStepDataRequests": true,
            "CollectionSplitType": 'All',
            "Tags": [
                "API Test"
            ]
        }

        const response = await post('/cycles', bodyData, accountId);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.status).to.eql(201);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.CreatedOnUtc).to.be.not.empty;
        expect(response.body.Name).eql('API Create Test Cycle');
        expect(response.body.Description).eql('Create cycle with API');
        expect(response.body.StepErrorAction).eql('Ignore');
        expect(response.body.LogStepDataRequests).eql(true);
        expect(response.body.CollectionSplitType).eql('All');
        expect(response.body.Tags[0]).eql('API Test');
        cycleId = response.body.Id;
    }).timeout(5000);

    it("gets a cycle by id", async function () {
        const response = await get('/cycles/' + cycleId, accountId);
        expect(response.status).to.eql(200);
        expect(response.body.Id).eql(cycleId);
        expect(response.body.CreatedOnUtc).to.be.not.empty;
        expect(response.body.Name).eql('API Create Test Cycle');
        expect(response.body.Description).eql('Create cycle with API');
        expect(response.body.StepErrorAction).eql('Ignore');
        expect(response.body.LogStepDataRequests).eql(true);
        expect(response.body.CollectionSplitType).eql('All');
        expect(response.body.Tags[0]).eql('API Test');
    }).timeout(5000);

    it("updates a cycle", async function () {
        let bodyData = {
            "Description": "New description",
            "StepErrorAction": "Retry",
            "LogStepDataRequests": false,
            "CollectionSplitType": "None",
        };

        const response = await put('/cycles/' + cycleId, bodyData, accountId);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Id).eql(cycleId);
        expect(response.body.CreatedOnUtc).to.be.not.empty;
        expect(response.body.Name).eql('API Create Test Cycle');
        expect(response.body.Description).eql('New description');
        expect(response.body.StepErrorAction).eql('Retry');
        expect(response.body.LogStepDataRequests).eql(false);
        expect(response.body.CollectionSplitType).eql('None');
        expect(response.body.Tags[0]).eql('API Test');

    }).timeout(5000);

    it("gets error incidents for all cyles with after date query", async function () {
        const response = await get('/cycles/incidents/error?pageSize=100&sortOrderAsc=true&after=2020-01-01', accountId);
        expect(response.status).to.eql(200);
        expect(response.body[0].CycleId).to.be.not.empty;
        expect(response.body[0].CycleName).to.be.not.empty;
        expect(response.body[0].IncidentLevel).eql('Error');
        expect(response.body[0].ShortMessage).to.be.not.empty;
        expect(response.body[0].FullMessage).to.be.not.empty;
        expect(response.body[0].StepId).to.be.not.empty;
        expect(response.body[0].StepName).to.be.not.empty;
        expect(response.body[0].TransactionId).to.be.not.empty;
    }).timeout(5000);

    it("gets error incidents for all cyles with before date query", async function () {
        const response = await get('/cycles/incidents/error?pageSize=100&sortOrderAsc=true&before=2025-01-01', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].CycleId).to.be.not.empty;
        expect(response.body[0].CycleName).to.be.not.empty;
        expect(response.body[0].IncidentLevel).eql('Error');
        expect(response.body[0].ShortMessage).to.be.not.empty;
        expect(response.body[0].FullMessage).to.be.not.empty;
        expect(response.body[0].StepId).to.be.not.empty;
        expect(response.body[0].StepName).to.be.not.empty;
        expect(response.body[0].TransactionId).to.be.not.empty;
    }).timeout(5000);

    it("gets warning incidents for all cyles with after date query", async function () {
        const response = await get('/cycles/incidents/warning?pageSize=100&sortOrderAsc=true&after=2020-01-01', accountId);

        expect(response.status).to.eql(200);
        if (response.body.length > 0) {
            expect(response.body[0].CycleId).to.be.not.empty;
            expect(response.body[0].CycleName).to.be.not.empty;
            expect(response.body[0].IncidentLevel).eql('Warning');
            expect(response.body[0].ShortMessage).to.be.not.empty;
            expect(response.body[0].FullMessage).to.be.not.empty;
            expect(response.body[0].StepId).to.be.not.empty;
            expect(response.body[0].StepName).to.be.not.empty;
            expect(response.body[0].TransactionId).to.be.not.empty;
        }
    }).timeout(5000);

    it("gets warning incidents for all cyles with before date query", async function () {
        const response = await get('/cycles/incidents/error?pageSize=100&sortOrderAsc=true&before=2025-01-01', accountId);

        expect(response.status).to.eql(200);
        if (response.body.length > 0) {
            expect(response.body[0].CycleId).to.be.not.empty;
            expect(response.body[0].CycleName).to.be.not.empty;
            expect(response.body[0].IncidentLevel).eql('Error');
            expect(response.body[0].ShortMessage).to.be.not.empty;
            expect(response.body[0].FullMessage).to.be.not.empty;
            expect(response.body[0].StepId).to.be.not.empty;
            expect(response.body[0].StepName).to.be.not.empty;
            expect(response.body[0].TransactionId).to.be.not.empty;
        }
    }).timeout(5000);

    it("gets incidents for a cyle", async function () {
        const response = await get('/cycles/' + cycleId + '/incidents?pageSize=100&sortOrderAsc=true', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("activates a cyle", async function () {
        let bodyData = {
            "RunOnce": true
        };

        const response = await put('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/activate', bodyData, accountId);
        expect(response.status).to.eql(200);
    }).timeout(10000);

    it("gets a step from the specified cycle", async function () {
        const response = await get('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/steps?filter=action', accountId);
        expect(response.status).to.eql(200);
        stepId = response.body[0].Id;
        expect(response.body[0].AccountConnector.Name).eql('Salesforce');
    }).timeout(5000);

    it("updates a step, cycle is still running, return 409", async function () {
        let bodyData = {
            "ActionType": "Action",
            "Description": "My SF test step"
        };

        const response = await put('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/steps/' + stepId, bodyData, accountId);
        expect(response.status).to.eql(409);
    }).timeout(5000);

    it("updates a cycle, cycle is still running, return 409", async function () {
        let bodyData = {
            "Description": "Stop cycle test",
            "StepErrorAction": "Retry",
            "LogStepDataRequests": false,
            "CollectionSplitType": "None",
        };

        const response = await put('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19', bodyData, accountId);
        expect(response.status).to.eql(409);
    }).timeout(5000);

    it("creates a new variable, cycle is still running, return 409", async function () {
        let bodyData = {
            "DisplayName": "JOVar1",
            "Value": "Test-ABC",
            "MappingType": "StaticValue"
        };

        const response = await post('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/variables', bodyData, accountId);
        expect(response.status).to.eql(409);
    }).timeout(5000);

    it("updates a collection of variables, cycle is still running, return 409", async function () {
        let bodyData = [{
            "DisplayName": "JOVar1",
            "Value": "Test-ABC-123",
            "MappingType": "StaticValue"
        }];

        const response = await patch('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/variables', bodyData, accountId);
        expect(response.status).to.eql(409);
    }).timeout(5000);

    it("updates the value of a variable, cycle is still running, return 409", async function () {
        let bodyData = {
            "DisplayName": "JOVar1",
            "Value": "XYZ",
            "MappingType": "StaticValue"
        };

        const response = await put('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/variables/JOVar1', bodyData, accountId);
        expect(response.status).to.eql(409);
    }).timeout(5000);

    it("deletes a variable from a cycle, cycle is still running, return 409", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/variables/JOVar1', bodyData, accountId);
        expect(response.status).to.eql(409);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("deletes a step, cycle is still running, return 409", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/steps/' + stepId, bodyData, accountId);
        expect(response.status).to.eql(409);
    }).timeout(5000);

    it("deactivates a cyle and finish transactions", async function () {
        let bodyData = {};
        const response = await put('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/deactivate?finishQueuedTransactions=true', bodyData, accountId);
        expect(response.status).to.eql(200);
    }).timeout(5000);

    it("deactivates a cyle and dont finish transactions", async function () {
        let bodyData = {};
        const response = await put('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/deactivate?finishQueuedTransactions=false', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets a step from the specified cycle", async function () {
        const response = await get('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/steps/' + stepId, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.AccountConnector.Name).eql('Salesforce');
    }).timeout(5000);

    it("updates a step", async function () {
        let bodyData = {
            "ActionType": "Action",
            "Description": "My SF test step"
        };

        const response = await put('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/steps/' + stepId, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Description).eql('My SF test step');
    }).timeout(5000);

    it("creates a new step", async function () {
        let bodyData = {
            "Name": "Test Step",
            "Description": "Test",
            "ActionType": 4,
            "DisplayPositionLeft": 0,
            "DisplayPositionTop": 0,
        };

        const response = await post('/cycles/' + cycleId + '/steps', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.Name).eql('Test Step');
        stepId = response.body.Id;
    }).timeout(5000);

    it("deletes a step", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/' + cycleId + '/steps/' + stepId, bodyData, accountId);
        expect(response.status).to.eql(200);
    }).timeout(5000);

    it("creates a new variable", async function () {
        let bodyData = {
            "DisplayName": "JOVar1",
            "Value": "Test-ABC",
            "MappingType": "StaticValue"
        };

        const response = await post('/cycles/' + cycleId + '/variables', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.DisplayName).to.eql('JOVar1');
        expect(response.body.SystemName).to.eql('JOVar1');
        expect(response.body.Value).to.eql('Test-ABC');
        expect(response.body.MappingType).to.eql('StaticValue');
    }).timeout(5000);

    it("updates a collection of variables", async function () {
        let bodyData = [{
            "DisplayName": "JOVar1",
            "Value": "Test-ABC-123",
            "MappingType": "StaticValue"
        }];

        const response = await patch('/cycles/' + cycleId + '/variables', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body[0].DisplayName).eql('JOVar1');
        expect(response.body[0].SystemName).eql('JOVar1');
        expect(response.body[0].Value).eql('Test-ABC-123');
        expect(response.body[0].MappingType).eql('StaticValue');
    }).timeout(5000);

    it("gets a variable from a cycle", async function () {
        const response = await get('/cycles/' + cycleId + '/variables/JOVar1', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.DisplayName).eql('JOVar1');
        expect(response.body.SystemName).eql('JOVar1');
        expect(response.body.Value).eql('Test-ABC-123');
        expect(response.body.MappingType).eql('StaticValue');
    }).timeout(5000);

    it("gets a variable from a cycle, variable not found, return 404", async function () {
        const response = await get('/cycles/' + cycleId + '/variables/XYX-JOHN', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("updates the value of a variable", async function () {
        let bodyData = {
            "DisplayName": "JOVar1",
            "Value": "XYZ",
            "MappingType": "StaticValue"
        };

        const response = await put('/cycles/' + cycleId + '/variables/JOVar1', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.body.DisplayName).to.eql('JOVar1');
        expect(response.body.SystemName).to.eql('JOVar1');
        expect(response.body.Value).to.eql('XYZ');
        expect(response.body.MappingType).to.eql('StaticValue');
    }).timeout(5000);

    it("deletes a variable from a cycle", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/' + cycleId + '/variables/JOVar1', bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets cycle setup prerequisites", async function () {
        const response = await get('/cycles/' + cycleId + '/prerequisites', accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).is.not.empty;
    }).timeout(5000);

    it("deletes a cycle", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/' + cycleId, bodyData, accountId);
        expect(response.status).to.eql(200);
    }).timeout(5000);

    it("Gets a list of cycles that have new template releases available", async function () {
        const response = await get('/cycles/upgradeable', accountId);
        expect(response.status).to.eql(200);
    })

    /*
    negative tests
    */
    it("gets a cycle by id, id not found, return 404", async function () {
        const response = await get('/cycles/11111111-c5ff-4352-8985-53b687049999', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("updates a cycle, id not found, return 404", async function () {
        let bodyData = {
            "Description": "New description",
            "StepErrorAction": "Retry",
            "LogStepDataRequests": false,
            "CollectionSplitType": "None",
        };

        const response = await put('/cycles/11111111-c5ff-4352-8985-53b687049999', bodyData, accountId);
        expect(response.status).to.eql(404);
    }).timeout(5000);

    it("deletes a cycle, id not found, return 404", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/11111111-c5ff-4352-8985-53b687049999', bodyData, accountId);
        expect(response.status).to.eql(404);
    }).timeout(5000);

    it("gets incidents for a cyle, id not found, return 404", async function () {
        const response = await get('/cycles/11111111-c5ff-4352-8985-53b68704636e/incidents?pageSize=100&sortOrderAsc=true', accountId);
        expect(response.status).to.eql(404);
    }).timeout(5000);

    it("deletes all incidents for a cyle, id not found, return 404", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/11111111-c5ff-4352-8985-53b68704636e/incidents?pageSize=100&sortOrderAsc=true', bodyData, accountId);
        expect(response.status).to.eql(404);
    }).timeout(5000);

    it("activates a cyle, id not found, return 404", async function () {
        let bodyData = {
            "RunOnce": true
        };

        const response = await put('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/activate', bodyData, accountId);
        expect(response.status).to.eql(404);
    }).timeout(10000);

    it("deactivates a cyle, id not found, return 404", async function () {
        let bodyData = {};
        const response = await put('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/deactivate?finishQueuedTransactions=true', bodyData, accountId);
        expect(response.status).to.eql(404);
    }).timeout(5000);

    it("gets a step from specified cycle, id not found, return 404", async function () {
        const response = await get('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/steps?filter=action', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("updates a step, action type invalid, return 400", async function () {
        let bodyData = {
            "ActionType": "XYZ-123",
            "Description": "My SF test step"
        };

        const response = await put('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/steps/' + stepId, bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("updates a step, cycle id not found, return 404", async function () {
        let bodyData = {
            "ActionType": "Action",
            "Description": "My SF test step"
        };

        const response = await put('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/steps/' + stepId, bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("deletes a step, step id not found, return 404", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/steps/11111111-0c80-41ed-b830-762b9d93d7e2', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("deletes a step, step id has incorrect format, return 400", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/bc974c60-9f32-410f-aa83-2b2817ad9a19/steps/X1111111-0c80-41ed-b830-762b9d93d7e2', bodyData, accountId);
        expect(response.status).to.eql(400);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets a variable from cycle, cycle id not found, return 404", async function () {
        const response = await get('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/variables', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("creates a new variable, cycle id not found, return 404", async function () {
        let bodyData = {
            "DisplayName": "JOVar1",
            "Value": "Test-ABC",
            "MappingType": "StaticValue"
        };

        const response = await post('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/variables', bodyData, accountId);
        expect(response.status).to.eql(404);
    }).timeout(5000);

    it("updates a collection of variables, cycle id not found, return 404", async function () {
        let bodyData = [{
            "DisplayName": "JOVar1",
            "Value": "Test-ABC-123",
            "MappingType": "StaticValue"
        }];

        const response = await patch('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/variables', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("gets a variable from a cycle, cycle id, return 404", async function () {
        const response = await get('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/variables/JOVar1', accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("updates the value of a variable, cycle id not found, return 404", async function () {
        let bodyData = {
            "DisplayName": "JOVar1",
            "Value": "XYZ",
            "MappingType": "StaticValue"
        };

        const response = await put('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/variables/JOVar1', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("deletes a variable from a cycle, cycle id not found, return 404", async function () {
        let bodyData = {};
        const response = await deletee('/cycles/11111111-9f32-410f-aa83-2b2817ad9a19/variables/JOVar1', bodyData, accountId);
        expect(response.status).to.eql(404);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);
});
