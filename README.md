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

  - **read** – gives the ability to read task, contact, group and list details and contents.
  - **write** – gives the ability to add and modify task, contact, group and list details and contents (also allows you to read).
  - **delete** – gives the ability to delete tasks, contacts, groups and lists (also allows you to read and write).


#### Generate an Auth URL

First, generate an Auth URL that the RTM User will open in their browser.  This 
will direct the RTM User to the Remember the Milk website where they will log in 
and authorize this program to access their account.

```javascript
const RTM = require('rtm-api');

// Get an API Key and Secret from the Remember the Milk website
const API_KEY = "Your RTM API Key";
const API_SECRET = "Your RTM API Secret";

// Create a RTMClient with your RTM API credentials and desired access level
let client = new RTM.client(API_KEY, API_SECRET, RTM.client.PERM_DELETE);

// Get an RTM Auth URL that will ask the RTM User to grant access to your client
RTM.auth.getAuthUrl(client, function(err, authUrl, frob) {
  
  // Have the User open the authUrl
  // Save the frob for the next step
  
});
```

#### Generate an Auth Token

Once the RTM User has opened the `authUrl` and given access to the program, 
pass the `frob` from the first step to the `getAuthToken` function to 
get an Auth Token to be used in future API calls.

```javascript
// From previous example...
const RTM = ...
let client = ...
let frob = ...

// Get an Auth Token for the User once they've authorized the frob
RTM.auth.getAuthToken(frob, client, function(err, user) {
  
  // If successful, the returned user will include the property `authToken`
  
});
```

#### Verify the Auth Token

The Auth Token can be verified at any point using the `verifyAuthToken` function.

```javascript
// From previous example...
const RTM = ...
let client = ...
let user = ...

RTM.auth.verifyAuthToken(user.authToken, client, function(verified) {
  
  // verified will be true if auth token can be used for API calls
  
});
```