const { expect, get, deletee, put } = require('./helper');

let accountId = '54bcef4d-1313-42c8-837a-22c2b11281a0';
let tempUser = 'Jo-temp-api-user';
let tempPwd = 'abc@1234567890';
let usersEndPoint = `/accounts/${accountId}/users`;

describe("GET /accounts/{accountId}/users", function () {
    it("gets a list of all usernames in the account", async function () {
        const response = await get(usersEndPoint, accountId)
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
        expect(response.body).to.have.length.greaterThan(0);
    }).timeout(5000);

    it("adds a user to the specified account", async function () {
        let bodyData = {
            "Password": tempPwd,
            "UserName": tempUser
        }

        const response = await put(usersEndPoint, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("sets a new password for the specified user", async function () {
        let bodyData = {
            "Password": tempPwd,
            "UserName": tempUser
        }

        const response = await put('/users', bodyData, accountId)
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);

    it("removes the user from the specified account", async function () {
        let bodyData = {
            "UserName": tempUser
        }

        const response = await deletee(usersEndPoint, bodyData, accountId);
        expect(response.status).to.eql(200);
        expect(response.header['x-content-type-options']).to.eql('nosniff');
    }).timeout(5000);
});
