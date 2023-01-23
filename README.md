
1) Once the tests have been dwonloaded/copied to your test directory run:  npm install 

2) Create a .env file with the following content where cid is the client id and cs is the
client secret OAuth2 credentials, these can be obtained from the console client credentials page.
The host parameter is in the form of xyz.cyclr.com

    grant_type=client_credentials
    cid=
    cs=
    host=

2) Create an empty file called token.json and store in the same directory as the test files 

3) Running Tests:
Run all tests sequentially with command:  npm test
Run individual test files with command:  npx mocha <filename>.js 
Run all files concurrently with command:  npm test -- --parallel