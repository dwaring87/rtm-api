Remember The Milk API Interface
===============================

**node module:** [rtm-api](https://www.npmjs.com/package/rtm-api)  
**GitHub repo:** [dwaring87/rtm-api](https://github.com/dwaring87/rtm-api)

---

This project is still being actively developed and is in a state of flux.


### User Authentication

In order to start making requests to the Remember the Milk API Server, an RTM 
user will have to authenticate themselves and authorize this program to access 
their account details.

Account permissions can be granted in one of three categories:

  - read – gives the ability to read task, contact, group and list details and contents.
  - write – gives the ability to add and modify task, contact, group and list details and contents (also allows you to read).
  - delete – gives the ability to delete tasks, contacts, groups and lists (also allows you to read and write).


#### Generate an Auth URL

First, generate an Auth URL that the RTM User will have to open in their 
browser.  This will direct the RTM User to the Remember the Milk website 
where they will log in and authorize this program to access their accounts.

```javascript
const auth = require('./src/api/auth.js');
let API_KEY = "Your RTM API Key";
let API_SECRET = "Your RTM API Secret";

auth.getAuthUrl(API_KEY, API_SECRET, "delete", function(err, authUrl, frob) {
  
  // Have the User open the authUrl
  // Save the frob for the next step
  
});
```

#### Generate an Auth Token

Once the RTM User has opened the `authUrl` and given access to the program, 
pass the `frob` from the first step to the `getAuthToken` function to 
get an Auth Token to be used in future API calls.

```javascript
const auth = require('./src/api/auth.js');
let API_KEY = "Your RTM API Key";
let API_SECRET = "Your RTM API Secret";
let frob = "";  // Use from from first step

auth.getAuthToken(API_KEY, API_SECRET, frob, function(err, token, user) {
  
  // Save the token for future use
  // user includes authenticated user information
  
});
```

#### Verify the Auth Token

The Auth Token can be verified at any point using the `verifyAuthToken` function.

```javascript
const auth = require('./src/api/auth.js');
let API_KEY = "Your RTM API Key";
let API_SECRET = "Your RTM API Secret";
let token = ""; // Use previously obtained auth token

auth.verifyAuthToken(API_KEY, API_SECRET, token, function(verified) {
  
  // verified will be true if auth token can be used for API calls
  
});
```