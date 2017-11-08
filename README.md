Remember The Milk API Interface
===============================

**node module:** [rtm-api](https://www.npmjs.com/package/rtm-api)  
**GitHub repo:** [dwaring87/rtm-api](https://github.com/dwaring87/rtm-api)

---

This Node module provides a wrapper around the Remember the Milk API.

You will need your own RTM API Key and Secret, available from the Remember the 
Milk [website](https://www.rememberthemilk.com/services/api/keys.rtm).


## Installation

This module can be installed via `npm`:

```
npm install rtm-api
```

or downloaded directly from the [GitHub repository](https://github.com/dwaring87/rtm-api).


## Documentation

Full documentation is available in the **/docs/** directory of this repository or 
online at [https://dwaring87.github.io/rtm-api/](https://dwaring87.github.io/rtm-api/).

Additional usage examples can be found in the repository's [wiki pages](https://github.com/dwaring87/rtm-api/wiki).


## Usage

Set up your API credentials by specifying your API Key, API Secret and the 
requested account permissions.

```javascript
const RTM = require('rtm-api');
let client = new RTM('API_KEY', 'API_SECRET', RTM.PERM_DELETE);   // An instance of RTMClient
```

Account permissions can be granted in one of three categories:

  - **read** – gives the ability to read task, contact, group and list details and contents.
  - **write** – gives the ability to add and modify task, contact, group and list details and contents (also allows you to read).
  - **delete** – gives the ability to delete tasks, contacts, groups and lists (also allows you to read and write).


### User Authentication

Almost all RTM API methods require an authorized user's `authToken`.  This is 
kept in the `RTMUser` class which can be instantiated manually if you already 
have a valid `authToken`:

```javascript
let user = new RTM.user('id', 'username', 'fullname', 'authToken');
``` 

Otherwise, an `authToken` can be obtained via the API using the steps outlined 
in the following sections.


#### Generate an Auth URL

First, generate an Auth URL that the RTM User will open in their browser.  This 
will direct the RTM User to the Remember the Milk website where they will log in 
and authorize this program to access their account.

```javascript
// Get an RTM Auth URL that will ask the RTM User to grant access to your client
client.auth.getAuthUrl(function(err, authUrl, frob) {
  if ( err ) {
    console.error(err.toString());
  }
  
  // Have the User open the authUrl
  console.log(authUrl);
  
  // Save the frob for the next step
  ...
  
});
```

#### Generate an Auth Token

Once the RTM User has opened the `authUrl` and given access to the program, 
pass the `frob` from the first step to the `getAuthToken` function to 
get an Auth Token to be used in future API calls.

```javascript
// Get an Auth Token for the User once they've authorized the frob
client.auth.getAuthToken(frob, function(err, user) {
  
  // If successful, the returned user will include the property `authToken`
  console.log(user.authToken);
  
  // Save the user for making authenticated API calls via user.get()
  
});
```

#### Verify the Auth Token

The Auth Token can be verified at any point using the `verifyAuthToken` function.

```javascript
client.auth.verifyAuthToken(user.authToken, function(verified) {
  
  // verified will be true if auth token can be used for API calls
  
});
```


### API Requests

To make a request to the RTM API, a [method name](https://www.rememberthemilk.com/services/api/methods.rtm) 
and callback function are required.  

If the RTM API method requires any parameters, they should be provided as 
an object with the parameters set as key/value pairs.  For example, if the 
method requires the parameters: abc=foo and xyz=bar then they should be provided 
as:
```
{
  abc: "foo",
  xyz: "bar"
}
```

If the API Method does not require a User's authToken, the request can be made 
using the `get` function available from the `RTMClient`.

```javascript
client.get('rtm.auth.getFrob', function(resp) {
  if ( !resp.isOk ) {
    console.error(resp.toString());
  }
  
  // Handle the Response
  console.log(resp.frob);
});
```

However, most API Methods will require a User's authToken.  This can be provided 
directly as an `auth_token` parameter or by calling the `get` function available 
from the `RTMUser` instance, which will automatically provide the authToken. 

```javascript
let params = {
  list_id: "list id",
  filter: "tasks filter"
};
user.get('rtm.tasks.getList', params, function(resp) {
  if ( !resp.isOk ) {
    console.error(resp.toString());
  }
  
  // Handle the Response
  console.log(resp);
});
```


### API Responses

The response returned in the callback of the `get` function will be one of either 
the `RTMError` (if the RTM API returned a status of 'fail') or `RTMSuccess` classes. 

For a successful response, the API response properties can be accessed directly 
from the `RTMSuccess` properties (`resp.tasks`, `resp.tasks.list`, etc).  All 
response properties are available via `resp.props`