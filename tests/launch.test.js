const { expect, post } = require('./helper');

let utc = new Date().toJSON().slice(0, 10);
const accountId = 'c9199456-20a4-4287-b2bf-d1d4c49fb8fa';
let userLaunchEndPoint = '/users/launch';
let accountLaunchEndPoint = `/accounts/${accountId}/launch`;
let orbitEndPoint = `/accounts/${accountId}/orbit`;
let userMpEndPoint = '/users/marketplace';
let accountMpEndPoint = `/accounts/${accountId}/marketplace`;

describe("POST /launch and /marketplace", function () {
    /*
    Launch
    */

    it("call user launch api with non-default parameter settings", async function () {
        let bodyData = {
            "AccountId": "c9199456-20a4-4287-b2bf-d1d4c49fb8fa",
            "Username": "john.owen@cyclr.com",
            "Password": "Testing123",
            "AccountName": "John Owen Test",
            "Start": "false",
            "RunOnce": "true",
            "AutoInstall": "false",
            "SingleInstall": "true",
            "completeParameter": "Test-Param-123-456-789-0",
            "wizard": "true",
            "DisplayDescriptions": true,
            "InlineOAuth": false,
            "tags": ["launch_test_tag", "api_test_tag"]
        }

        const response = await post(userLaunchEndPoint, bodyData, accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.AccountId).includes(accountId);
        expect(response.body.LaunchUrl).includes(response.body.Token);
        expect(response.body.LaunchUrl).includes('inline=false');
        expect(response.body.LaunchUrl).includes('start=false');
        expect(response.body.LaunchUrl).includes('once=true');
        expect(response.body.LaunchUrl).includes('auto=false');
        expect(response.body.LaunchUrl).includes('single=true');
        expect(response.body.LaunchUrl).includes('wizard=true');
        expect(response.body.LaunchUrl).includes('descriptions=true');
        expect(response.body.LaunchUrl).includes('Test-Param-123-456-789-0');
        expect(response.body.LaunchUrl).includes('launch_test_tag');
        expect(response.body.LaunchUrl).includes('api_test_tag');
    }).timeout(2000);

    it("call user launch api with default parameter settings", async function () {
        let bodyData = {
            "AccountId": "c9199456-20a4-4287-b2bf-d1d4c49fb8fa",
            "Username": "john.owen@cyclr.com",
            "Password": "Testing123",
            "AccountName": "John Owen Test",
            "Start": "true",
            "RunOnce": "false",
            "AutoInstall": "true",
            "SingleInstall": "false",
            "completeParameter": "Test-Param-123-456-789-0",
            "wizard": "false",
            "DisplayDescriptions": false,
            "InlineOAuth": true,
            "tags": ["launch_test_tag", "api_test_tag"]
        }

        const response = await post('/accounts/' + accountId + '/launch', bodyData, accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.AccountId).includes(accountId);
        expect(response.body.LaunchUrl).includes(response.body.Token);
        expect(response.body.LaunchUrl).does.not.includes('inline=false');
        expect(response.body.LaunchUrl).does.not.includes('start=');
        expect(response.body.LaunchUrl).does.not.includes('once=');
        expect(response.body.LaunchUrl).does.includes('auto=true');
        expect(response.body.LaunchUrl).does.includes('single=false');
        expect(response.body.LaunchUrl).does.not.includes('wizard=true');
        expect(response.body.LaunchUrl).does.not.includes('descriptions=true');
        expect(response.body.LaunchUrl).includes('Test-Param-123-456-789-0');
        expect(response.body.LaunchUrl).includes('launch_test_tag');
        expect(response.body.LaunchUrl).includes('api_test_tag');
    }).timeout(2000);

    it("call account launch api with non-default parameter settings", async function () {
        let bodyData = {
            "AccountName": "John Owen Test",
            "Start": "false",
            "RunOnce": "true",
            "AutoInstall": "false",
            "SingleInstall": "true",
            "completeParameter": "Test-Param-123-456-789-0",
            "wizard": "true",
            "DisplayDescriptions": true,
            "InlineOAuth": false,
            "tags": ["launch_test_tag", "api_test_tag"]
        }

        const response = await post(accountLaunchEndPoint, bodyData, accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.AccountId).includes(accountId);
        expect(response.body.LaunchUrl).includes(response.body.Token);
        expect(response.body.LaunchUrl).includes('inline=false');
        expect(response.body.LaunchUrl).includes('start=false');
        expect(response.body.LaunchUrl).includes('once=true');
        expect(response.body.LaunchUrl).includes('auto=false');
        expect(response.body.LaunchUrl).includes('single=true');
        expect(response.body.LaunchUrl).includes('wizard=true');
        expect(response.body.LaunchUrl).includes('descriptions=true');
        expect(response.body.LaunchUrl).includes('Test-Param-123-456-789-0');
        expect(response.body.LaunchUrl).includes('launch_test_tag');
        expect(response.body.LaunchUrl).includes('api_test_tag');
    }).timeout(2000);

    it("call user launch api with default parameter settings", async function () {
        let bodyData = {
            "AccountName": "John Owen Test",
            "Start": "true",
            "RunOnce": "false",
            "AutoInstall": "true",
            "SingleInstall": "false",
            "completeParameter": "Test-Param-123-456-789-0",
            "wizard": "false",
            "DisplayDescriptions": false,
            "InlineOAuth": true,
            "tags": ["launch_test_tag", "api_test_tag"]
        }

        const response = await post(accountLaunchEndPoint, bodyData, accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.AccountId).includes(accountId);
        expect(response.body.LaunchUrl).includes(response.body.Token);
        expect(response.body.LaunchUrl).does.not.includes('inline=');
        expect(response.body.LaunchUrl).does.not.includes('start=');
        expect(response.body.LaunchUrl).does.not.includes('once=');
        expect(response.body.LaunchUrl).does.includes('auto=true');
        expect(response.body.LaunchUrl).does.includes('single=false');
        expect(response.body.LaunchUrl).does.not.includes('wizard=true');
        expect(response.body.LaunchUrl).does.not.includes('descriptions=true');
        expect(response.body.LaunchUrl).includes('Test-Param-123-456-789-0');
        expect(response.body.LaunchUrl).includes('launch_test_tag');
        expect(response.body.LaunchUrl).includes('api_test_tag');
    }).timeout(2000);

    it("successful call to orbit api", async function () {
        let bodyData = {}
        const response = await post(orbitEndPoint, bodyData, accountId);
        
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.OrbitUrl).includes(response.body.Token);
    }).timeout(2000);

    /*
    Marketplace
    */

    it("call user marketplace api with InlineOAuth=false", async function () {
        let bodyData = {
            "MarketplaceId": "8",
            "AccountId": "c9199456-20a4-4287-b2bf-d1d4c49fb8fa",
            "Username": "john.owen@cyclr.com",
            "Password": "Testing123",
            "AccountName": "John Owen Test",
            "InlineOAuth": false
        }

        const response = await post(userMpEndPoint, bodyData, accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.AccountId).includes(accountId);
        expect(response.body.MarketplaceUrl).includes(response.body.Token);
        expect(response.body.MarketplaceUrl).includes('inline=false');
    }).timeout(2000);

    it("call user marketplace api with InlineOAuth=true", async function () {
        let bodyData = {
            "MarketplaceId": "8",
            "AccountId": "c9199456-20a4-4287-b2bf-d1d4c49fb8fa",
            "Username": "john.owen@cyclr.com",
            "Password": "Testing123",
            "AccountName": "John Owen Test",
            "InlineOAuth": true
        }

        const response = await post(userMpEndPoint, bodyData, accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.AccountId).includes(accountId);
        expect(response.body.MarketplaceUrl).includes(response.body.Token);
        expect(response.body.MarketplaceUrl).does.not.includes('inline=');
    }).timeout(2000);

    it("call user marketplace api with InlineOAuth not defined", async function () {
        let bodyData = {
            "MarketplaceId": "8",
            "AccountId": "c9199456-20a4-4287-b2bf-d1d4c49fb8fa",
            "Username": "john.owen@cyclr.com",
            "Password": "Testing123",
            "AccountName": "John Owen Test",
            "InlineOAuth": true
        }

        const response = await post(userMpEndPoint, bodyData, accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.AccountId).includes(accountId);
        expect(response.body.MarketplaceUrl).includes(response.body.Token);
        expect(response.body.MarketplaceUrl).does.not.includes('inline=');
    }).timeout(2000);

    it("call account marketplace api with InlineOAuth=false", async function () {
        let bodyData = {
            "MarketplaceId": "8",
            "AccountName": "John Owen Test",
            "InlineOAuth": false
        }

        const response = await post(accountMpEndPoint, bodyData, accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.AccountId).includes(accountId);
        expect(response.body.MarketplaceUrl).includes(response.body.Token);
        expect(response.body.MarketplaceUrl).includes('inline=false');
    }).timeout(2000);

    it("call account marketplace api with InlineOAuth=true", async function () {
        let bodyData = {
            "MarketplaceId": "8",
            "AccountName": "John Owen Test",
            "InlineOAuth": true
        }

        const response = await post(accountMpEndPoint, bodyData, accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.AccountId).includes(accountId);
        expect(response.body.MarketplaceUrl).includes(response.body.Token);
        expect(response.body.MarketplaceUrl).does.not.includes('inline=');
    }).timeout(2000);

    it("call account marketplace api with InlineOAuth not defined", async function () {
        let bodyData = {
            "MarketplaceId": "8",
            "AccountName": "John Owen Test",
        }

        const response = await post(accountMpEndPoint, bodyData, accountId);

        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body.ExpiresAtUtc).includes(utc);
        expect(response.body.AccountId).includes(accountId);
        expect(response.body.MarketplaceUrl).includes(response.body.Token);
        expect(response.body.MarketplaceUrl).does.not.include('inline=');
    }).timeout(2000);
});




/*
"Enable inline OAuth connector authentication" = Ticked in general settings

Request				     Response
=====================		 =================
InlineOAuth = false  	 	 URL inline = false
InlineOAuth = true		 URL inline not present  
InlineOAuth = undefined      	 URL inline not present  


"Enable inline OAuth connector authentication" = Not Ticked in general settings

Request				    Response
=====================		 =================
InlineOAuth = false  	 	 URL inline = false
InlineOAuth = true		 URL inline not present	       
InlineOAuth = undefined  	 URL inline = false
*/