'use strict';

const _get = require('./utils/get.js');
const _auth = require('./utils/auth.js');
const _lists = require('./lists/helper.js');
const _tasks = require('./tasks/helper.js');
const errors = require('./response/error.js');

/**
 * ### RTM User
 *
 * This Class is used to represent an authorized RTM User.  An `RTMUser` instance
 * contains the user's ID, username and fullname as well as an auth token that can
 * be used to make user-authenticated API requests.
 *
 * #### Usage
 *
 * An `RTMUser` instance can created manually with an {@link RTMClient}:
 *
 * ```
 * let user = client.user(1234, 'username', 'full name', 'auth_token');
 * ```
 *
 * or can be returned through the RTM API auth process (specifically the callback
 * function from {@link RTMClient~auth/getAuthToken|RTMClient.auth.getAuthToken()}).
 *
 * ```
 * // Get an Auth URL
 * client.auth.getAuthUrl(function(err, authUrl, frob) {
 *
 *    // Have the User open this URL in their browser
 *    console.log(authUrl);
 *
 *    // Get an authenticated RTMUser
 *    client.auth.getAuthToken(frob, function(err, user) {
 *
 *      // user is an instance of RTMUser
 *
 *    });
 *
 * });
 * ```
 *
 * #### API Wrappers
 *
 * The `RTMUser` also includes a number of wrapper functions for commonly
 * used RTM API methods.
 *
 * **Lists:**
 *
 * For example, to get the User's RTM Lists:
 *
 * ```
 * user.lists.update(function(err, lists) {
 *    console.log(lists);
 *    // or
 *    console.log(user.lists.get());
 * });
 * ```
 * 
 * The `lists.update()` function will save the RTM Lists to the RTMUser and
 * will be available via `lists.get()` without having to make another API request.
 *
 * @class
 */
class RTMUser {

  /**
   * Create a new RTM User.
   *
   * An `RTMUser` can be used to make user-authenticated RTM API calls and also
   * includes wrapper methods around some common RTM API methods.
   * @param {number} id The RTM User's ID
   * @param {string} username The RTM User's username
   * @param {string} fullname The RTM User's full name
   * @param {string} authToken The RTM User's Auth Token
   * @constructor
   */
  constructor(id, username, fullname, authToken) {
    this._id = parseFloat(id);
    this._username = username;
    this._fullname = fullname;
    this._authToken = authToken;
    this._client = undefined;
    this._timeline = undefined;
    this._lists = undefined;
    this._tasks = undefined;
  }


  // ==== RTMUser PROPERTY GETTERS & SETTERS ==== //

  /**
   * RTM User ID
   * @returns {string}
   */
  get id() {
    return this._id;
  }

  /**
   * RTM User Username
   * @returns {string}
   */
  get username() {
    return this._username;
  }

  /**
   * RTM User fullname
   * @returns {string}
   */
  get fullname() {
    return this._fullname;
  }

  /**
   * RTM User Auth Token
   * @returns {string}
   */
  get authToken() {
    return this._authToken;
  }

  /**
   * Set the RTM User Auth Token
   * @param {string} token
   * @private
   */
  set authToken(token) {
    this._authToken = token;
  }

  /**
   * The {@link RTMClient} that authorized this User
   * @returns {RTMClient}
   */
  get client() {
    if ( !this._client ) {
      throw "User does not have Client specified";
    }
    return this._client;
  }

  /**
   * Set the Client that authorized this User
   * @param {RTMClient} client
   * @private
   */
  set client(client) {
    this._client = client;
  }

  /**
   * The RTM Timeline for this User
   * @returns {number}
   */
  get timeline() {
    if ( !this._timeline ) {
      throw "User does not have a valid timeline set";
    }
    return this._timeline;
  }

  /**
   * Set the RTM Timeline for this User
   * @param {number} timeline
   * @private
   */
  set timeline(timeline) {
    this._timeline = parseFloat(timeline);
  }


  // ==== API HELPER FUNCTIONS ==== //

  /**
   * Make the specified RTM API call.
   *
   * The `method` should be the name of the RTM API method.  Any necessary
   * parameters should be provided with `params` as an object with the properties
   * of the object as the parameters' key/value pairs.
   *
   * This function will automatically add the User's auth token to the request.
   * @param {string} method RTM API Method
   * @param {object} [params={}] RTM API Method Parameters
   * @param {function} callback Callback function(resp)
   * @param {RTMError|RTMSuccess} callback.resp The parsed RTM API Response
   */
  get(method, params, callback) {
    _get(method, params, this, this.client, callback);
  }

  /**
   * Verify the Auth Token of this RTM User
   * @param {function} callback Callback function(verified)
   * @param {boolean} callback.verified True if the auth token is successfully verified
   */
  verifyAuthToken(callback) {
    _auth.verifyAuthToken(this.authToken, this.client, callback);
  }


  /**
   * RTM List related functions:
   * - {@link RTMUser~lists/get|get}
   * - {@link RTMUser~lists/update|update}
   * - {@link RTMUser~lists/add|add}
   * - {@link RTMUser~lists/rename|rename}
   * - {@link RTMUser~lists/remove|remove}
   * @returns {object}
   */
  get lists() {
    let rtn = {};
    let _user = this;

    /**
     * Get the stored list of RTM Lists for this User.
     *
     * Note: {@link RTMUser~lists/update|lists/update()} needs to be called first.
     * @returns {RTMList[]}
     * @function RTMUser~lists/get
     */
    rtn.get = function() {
      if ( _user._lists === undefined ) {
        throw "User's RTM Lists need to be updated first"
      }
      return _user._lists;
    };

    /**
     * Update the list of RTM Lists for this User
     * @param {function} callback Callback function(err, lists)
     * @param {RTMError} callback.err RTM API Error Response, if encountered
     * @param {RTMList[]} callback.lists List of User's RTM Lists
     * @function RTMUser~lists/update
     */
    rtn.update = function(callback) {
      _lists.get(_user, callback);
    };

    /**
     * Add a new RTM List for this User
     * @param {string} name Name of the new RTM List
     * @param {function} callback Callback function(err, lists)
     * @param {RTMError} callback.err RTM API Error Response, if encountered
     * @param {RTMList[]} callback.lists List of User's RTM Lists
     * @function RTMUser~lists/add
     */
    rtn.add = function(name, callback) {
      _lists.add(name, _user, callback);
    };

    /**
     * Remove the specified RTM List for this User
     * @param {int} index RTM List index
     * @param {function} callback Callback function(err, lists)
     * @param {RTMError} callback.err RTM API Error Response, if encountered
     * @param {RTMList[]} callback.lists List of User's RTM Lists
     * @function RTMUser~lists/remove
     */
    rtn.remove = function(index, callback) {
      if ( _user._lists ) {
        for ( let i = 0; i < _user._lists.length; i++ ) {
          if ( _user._lists[i].index === index ) {
            return _lists.remove(_user._lists[i].id, _user, callback);
          }
        }
      }
      return callback(errors.indexError());
    };

    /**
     * Rename the specified RTM List for this User
     * @param {int} index RTM List index
     * @param {string} name New RTM List name
     * @param {function} callback Callback function(err, lists)
     * @param {RTMError} callback.err RTM API Error Response, if encountered
     * @param {RTMList[]} callback.lists List of User's RTM Lists
     * @function RTMUser~lists/rename
     */
    rtn.rename = function(index, name, callback) {
      if ( _user._lists ) {
        for ( let i = 0; i < _user._lists.length; i++ ) {
          if ( _user._lists[i].index === index ) {
            return _lists.rename(_user._lists[i].id, name, _user, callback);
          }
        }
      }
      return callback(errors.indexError());
    };

    return rtn;
  }


  /**
   * RTM Task related functions:
   * - {@link RTMUser~tasks/get|get}
   * - {@link RTMUser~tasks/update|update}
   * - {@link RTMUser~tasks/add|add}
   * @returns {object}
   */
  get tasks() {
    let rtn = {};
    let _user = this;

    /**
     * Get the stored list of RTM Tasks for this User.
     *
     * Note: {@link RTMUser~tasks/update|tasks/update()} needs to be called first.
     * @returns {RTMTask[]}
     * @function RTMUser~tasks/get
     */
    rtn.get = function() {
      if ( _user._tasks === undefined ) {
        throw "User's RTM Tasks need to be updated first"
      }
      return _user._tasks;
    };

    /**
     * Update the list RTM Tasks for this User
     * @param {function} callback Callback function(err, tasks)
     * @param {RTMError} callback.err RTM API Response, if encountered
     * @param {RTMTask[]} callback.tasks List of User's RTM Tasks
     * @function RTMUser~tasks/update
     */
    rtn.update = function(callback) {
      _tasks.get(_user, callback);
    };

    /**
     * Add a new RTM Task for this User
     * @param {string} name Task Name (can include 'Smart Add' syntax)
     * @param {object} [props] Task Properties
     * @param {string} props.due Task Due Date (RTM supported date format)
     * @param {int} props.priority Task Priority (1, 2, 3)
     * @param {string} props.list Task List Name
     * @param {string[]} props.tags Task Tags
     * @param {string} props.location Task Location Name
     * @param {string} props.start Task Start Date (RTM supported date format)
     * @param {string} props.repeat Task Repeat Format (RTM supported repeat format)
     * @param {string} props.estimate Task Time Estimate (RTM supported time estimate format)
     * @param {string} props.to Contact Name to give Task to (existing contact or email address)
     * @param {string} props.url Task Reference URL
     * @param {string} props.note Task Note
     * @param {function} callback Callback function(err, tasks)
     * @param {RTMError} callback.err RTM API Response, if encountered
     * @param {RTMTask[]} callback.tasks List of User's RTM Tasks
     * @function RTMUser~tasks/add
     */
    rtn.add = function(name, props, callback) {
      if ( callback === undefined && typeof props === 'function' ) {
        callback = props;
        props = {};
      }
      _tasks.add(name, props, _user, callback);
    };

    return rtn;
  }

}





// ==== IMPORT / EXPORT FUNCTIONS ===== //

/**
 * Export the required User information to a JSON string
 * @param {RTMUser} user RTM User to export
 */
RTMUser.toString = function(user) {
  let rtn = {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    authToken: user.authToken,
    timeline: user._timeline
  };
  if ( user.client ) {
    rtn.client = {
      apiKey: user.client.key,
      apiSecret: user.client.secret,
      perms: user.client.perms
    }
  }
  return JSON.stringify(rtn);
};

/**
 * Create a new RTMUser from a JSON-string
 * @param {string} string JSON string of required user information
 * @returns {RTMUser}
 */
RTMUser.fromString = function(string) {
  let RTMClient = require('./client.js');
  let json = JSON.parse(string);
  if ( json.id && json.username && json.fullname && json.authToken ) {
    let user = new RTMUser(json.id, json.username, json.fullname, json.authToken);
    if ( json.client ) {
      user.client = new RTMClient(json.client.apiKey, json.client.apiSecret, json.client.perms);
    }
    return user;
  }
  else {
    throw "User string missing required information";
  }
};


module.exports = RTMUser;
