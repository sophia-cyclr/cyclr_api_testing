const fs = require('fs');
require('dotenv').config();
const request = require("supertest")(`https://api.${process.env.host}/v1.0`);
const tokenReq = require("supertest")(`https://api.${process.env.host}`);
const expect = require("chai").expect;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
let tokenFileUpdated = false;

async function get(endPoint, accountId) {
  const token = await getToken();

  const response = await request.get(endPoint)
    .set("Authorization", 'Bearer ' + token)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('X-Cyclr-Account', accountId);

  return response;
}

async function post(endPoint, bodyData, accountId) {
  let token = await getToken();

  const response = await request.post(endPoint)
    .set("Authorization", 'Bearer ' + token)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('X-Cyclr-Account', accountId)
    .send(bodyData);

  return response;
}

async function put(endPoint, bodyData, accountId) {
  let token = await getToken();

  const response = await request.put(endPoint)
    .set("Authorization", 'Bearer ' + token)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('X-Cyclr-Account', accountId)
    .send(bodyData);

  return response;

}

async function patch(endPoint, bodyData, accountId) {
  let token = await getToken();

  const response = await request.patch(endPoint, accountId)
    .set("Authorization", 'Bearer ' + token)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('X-Cyclr-Account', accountId)
    .send(bodyData);

  return response;
}

async function deletee(endPoint, bodyData, accountId) {
  let token = await getToken();

  const response = await request.delete(endPoint, accountId)
    .set("Authorization", 'Bearer ' + token)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('X-Cyclr-Account', accountId)
    .send(bodyData);

  return response;
}

async function getToken() {

  let now;
  let tokenExpiresDate;
  let isTokenFileOk = true;

  if (tokenFileUpdated === false) {

    try {
      let tokenFileJSON = fs.readFileSync('token.json');
      const tokenFileObj = JSON.parse(tokenFileJSON);
      now = Date.now()
      tokenExpiresDate = Date.parse(tokenFileObj['.expires']);

      if (isNaN(tokenExpiresDate) === true) {
        isTokenFileOk = false;
        console.log('The expire date in token file is invalid');
      }
    }
    catch (err) {
      console.log('Error in the Token file : ', err);
      isTokenFileOk = false;
    }

    if ((now > tokenExpiresDate) || isTokenFileOk === false) {
      console.log('write new token to token file');
      const reqBody = `grant_type=${process.env.grant_type}&client_id=${process.env.cid}&client_secret=${process.env.cs}`;

      const response = await tokenReq.post('/oauth/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', '*/*')
        .send(reqBody);

      expect(response.status).eql(200);
      console.log('status response for token request : ', response.status);

      try {
        fs.writeFileSync('token.json', JSON.stringify(response.body));
        tokenFileUpdated = true;
        return response.body.access_token;
      } catch (err) {
        console.log(err);
      }
    }
  }

  try {
    let tokenFileJSON = fs.readFileSync('token.json');
    const tokenFileObj = JSON.parse(tokenFileJSON);
    return tokenFileObj.access_token;
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = {
  expect,
  get,
  post,
  put,
  patch,
  deletee
};