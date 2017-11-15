'use strict';


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
 * let user = client.user.create(1234, 'username', 'full name', 'auth_token');
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
 * used RTM API methods dealing with Lists and Tasks.
 *
 * **Tasks:**
 *
 * For example, to get the User's RTM Tasks:
 *
 * ```
 * user.tasks.get(function(err, tasks) {
 *    console.log(tasks);
 * });
 * ```
 *
 * The `tasks.get()` function will also fetch the User's RTM Lists and add
 * the List (as an `RTMList` instance) that contains the Task to the `list`
 * property of the `RTMTask`.
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
  }


  // ==== RTMUser PROPERTY GETTERS & SETTERS ==== //

  /**
   * RTM User ID
   * @type {number}
   */
  get id() {
    return this._id;
  }

  /**
   * RTM User Username
   * @type {string}
   */
  get username() {
    return this._username;
  }

  /**
   * RTM User fullname
   * @type {string}
   */
  get fullname() {
    return this._fullname;
  }

  /**
   * RTM User Auth Token
   * @type {string}
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
   * @type {RTMClient}
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
   * @type {number}
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
   * @param {object} [params] RTM API Method Parameters
   * @param {function} callback Callback function(err, resp)
   * @param {RTMError} callback.err RTM Error Response, if encountered
   * @param {RTMSuccess} callback.resp The parsed RTM API Response, if successful
   */
  get(method, params, callback) {
    require('../utils/get.js')(method, params, this, this.client, callback);
  }

  /**
   * Verify the Auth Token of this RTM User
   * @param {function} callback Callback function(err, verified)
   * @param {RTMError} callback.err RTM Error, if encountered (excluding a `Login failed / Invalid auth token` error)
   * @param {boolean} callback.verified `true` if the User's auth token was successfully verified or `false` if
   * a `Login failed / Invalid auth token` error was encountered
   */
  verifyAuthToken(callback) {
    require('../utils/auth.js').verifyAuthToken(this.authToken, this.client, callback);
  }

  /**
   * Clear the Task Index Cache for this RTM User
   */
  clearTaskIndexCache() {
    require('../utils/taskIds.js').clear(this.id);
  }


  /**
   * RTM List related functions:
   * - {@link RTMUser~lists/get|get}
   * - {@link RTMUser~lists/add|add}
   * - {@link RTMUser~lists/rename|rename}
   * - {@link RTMUser~lists/remove|remove}
   * @returns {{get: function, add: function, remove: function, rename: function}}
   */
  get lists() {
    return require('./lists.js')(this);
  }


  /**
   * RTM Task related functions:
   * - {@link RTMUser~tasks/get|get}
   * - {@link RTMUser~tasks/add|add}
   * - {@link RTMUser~tasks/remove|remove}
   * - {@link RTMUser~tasks/complete|complete}
   * - {@link RTMUser~tasks/addTags|addTags}
   * - {@link RTMUser~tasks/removeTags|removeTags}
   * - {@link RTMUser~tasks/priority|priority}
   * - {@link RTMUser~tasks/decreasePriority|decreasePriority}
   * - {@link RTMUser~tasks/increasePriority|increasePriority}
   * - {@link RTMUser~tasks/move|move}
   * - {@link RTMUser~tasks/setDueDate|setDueDate}
   * - {@link RTMUser~tasks/postpone|postpone}
   * - {@link RTMUser~tasks/setName|setName}
   * @returns {{get: function, add:function, remove: function, complete: function, addTags: function, removeTags: function, priority: function, decreasePriority: function, increasePriority: function, move: function, setDueDate: function, postpone: function, setName: function}}
   */
  get tasks() {
    return require('./tasks.js')(this);
  }

}


module.exports = RTMUser;
