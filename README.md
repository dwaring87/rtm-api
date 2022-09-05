Remember The Milk API Interface
===============================

**node module:** [rtm-api](https://www.npmjs.com/package/rtm-api)  
**GitHub repo:** [dwaring87/rtm-api](https://github.com/dwaring87/rtm-api)

---

This Node module provides a wrapper around the Remember the Milk API.

You will need your own RTM API Key and Secret, available from the Remember the 
Milk [website](https://www.rememberthemilk.com/services/api/keys.rtm).


## Main Features

- Two-step User Authorization procedure

- Direct RTM API Requests

```javascript
// Requests are automatically signed and include the User's Auth Token
user.get('rtm.method', {param: 'value'}, function(err, response) {
  if ( err ) {
    return console.error(err.toString());
  }
  console.log(response);
});
```

- Basic Error Handling and Response Parsing

- Per-User Rate Limiting (following RTM API guidelines)

- Helper Classes and Functions for **Lists** and **Tasks**

```javascript
// Optional filter selecting tasks with a priority of 1
user.tasks.get('priority:1', function(err, tasks) {
  if ( err ) {
    return console.error(err.toString());
  }
  tasks.forEach(function(task){
    // task is an RTMTask instance
    console.log(task.priority);
    console.log(task.name);
  });
});
```


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

Almost all RTM API methods require an authorized user's Auth Token.  This is 
kept in the `RTMUser` class which can be instantiated manually if you already 
have the User's information with a valid Auth Token:

```javascript
let user = client.user.create(id, 'username', 'fullname', 'authToken');
``` 

Otherwise, an Auth Token can be obtained via the API using the steps outlined 
in the following sections.


#### Generate an Auth URL

First, generate an Auth URL that the RTM User will open in their browser.  This 
will direct the RTM User to the Remember the Milk website where they will log in 
and authorize this program to access their account.

```javascript
// Get an RTM Auth URL that will ask the RTM User to grant access to your client
client.auth.getAuthUrl(function(err, authUrl, frob) {
  if ( err ) {
    return console.error(err.toString());
  }
  
  // Have the User open the authUrl
  console.log(authUrl);
  
  // Save the frob for the next step
  ...
  
});
```

#### Generate an Auth Token

Once the RTM User has opened the `authUrl` and granted access to the program, 
pass the `frob` from the first step to the `getAuthToken` function to 
get an `RTMUser` with an Auth Token to be used in future API calls.

```javascript
// Get an Auth Token for the User once they've authorized the frob
client.auth.getAuthToken(frob, function(err, user) {
  if ( err ) {
    return console.error(err.toString());
  }
  
  // If successful, the returned user will include the property `authToken`
  console.log(user.authToken);
  
  // Save the user for making authenticated API calls via user.get()
  
});
```

#### Verify the Auth Token

The Auth Token can be verified at any point using the `verifyAuthToken` function.

```javascript
client.auth.verifyAuthToken(user.authToken, function(err, verified) {
  
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

If the API Method does not require a User's Auth Token, the request can be made 
using the `get` function available from the `RTMClient`.

```javascript
client.get('rtm.auth.getFrob', function(err, resp) {
  if ( err ) {
    return console.error(err.toString());
  }
  
  // Handle the Response
  console.log(resp.frob);
});
```

However, most API Methods will require a User's Auth Token.  This can be provided 
directly as an `auth_token` parameter or by calling the `get` function available 
from the `RTMUser` instance, which will automatically provide the Auth Token. 

```javascript
let params = {
  list_id: "list id",
  filter: "tasks filter"
};
user.get('rtm.tasks.getList', params, function(err, resp) {
  if ( err ) {
    return console.error(err.toString());
  }
  
  // Handle the Response
  console.log(resp);
});
```


### API Responses

The arguments returned in the callback of the `get` function will include an 
`RTMError` instance (if the RTM API returned a status of 'fail') or an 
`RTMSuccess` instance for successful requests.

#### Error Responses

An `RTMError` response will have `code` and `msg` properties set based on the 
RTM API response.  

Additional error codes are added by `rtm-api`:

|error code | error description|
|:---------:|------------------|
|    -1     | **Network Error**: `rtm-api` could not connect to the RTM API Server.|
|    -2     | **Response Error**: `rtm-api` could not parse the response from the RTM API Server.|
|    -3     | **Reference Error**: An `RTMTask` index is out of range or RTM item could not be found with the given reference.|
|    -4     | **Rate Limit Error**: The RTM User has reached the API request rate limit set by the RTM API Server.|
|    -5     | **Server Error**: `rtm-api` encountered a problem with the RTM API Server.  Try the request again later.|


#### Successful Responses

For a successful response, the API response properties can be accessed directly 
from the `RTMSuccess` properties (`resp.tasks`, `resp.tasks.list`, etc).  All 
response properties are available via `resp.props`


### Helper Functions

`rtm-api` includes a number of helper classes & functions for commonly used API 
methods used to obtain and modify RTM Lists and Tasks.  These functions are 
available via an `RTMUser` instance's `lists` and `tasks` properties.

The following **list** functions are available:

  - `get()`: get an array of `RTMList`s
  - `add()`: add a new List
  - `archive()`: archive a List
  - `rename()`: rename a List
  - `remove()`: remove a List
  
The following **task** functions are available:

  - `get()`: get an array of `RTMTasks`s (with the Tasks's `RTMList` added to the `list` property)
  - `getTask()`: get a specific Task (specified by a Task Index)
  - `add()`: add a new Task
  - `remove()`: remove a Task
  - `complete()`: mark a Task as completed
  - `uncomplete()`: mark a Task as NOT completed
  - `addTags()`: add one or tags to a Task
  - `addNotes()`: add one or more notes to a Task
  - `removeTags()`: remove one or more tags from a Task
  - `priority()`: set the Priority of a Task
  - `decreasePriority()`: decrease the Priority of a Task
  - `increasePriority()`: increase the Priority of a Task
  - `move()`: move a Task to a different List
  - `setDueDate()`: set the due date of a Task
  - `setStartDate()`: set the start date of a Task
  - `postpone()`: postpone the due date of Task by one day
  - `setName()`: set the name of a Task
  - `setURL()`: set the URL of a Task

See the `RTMUser` entry in the **Documentation** for more information on the
Helper Functions.
  
Examples using the helper functions can be found in the repository's 
[wiki pages](https://github.com/dwaring87/rtm-api/wiki).
