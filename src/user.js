'use strict';

const lists = require('./lists/');

/**
 * ### RTM User
 *
 * This Class is used to represent an authorized RTM User.  The User contains
 * the user's ID, username and fullname as well as an auth token that can
 * be used in RTM API calls.
 * @class
 * @alias RTMUser
 */
class RTMUser {

  /**
   * Create a new RTM User.
   *
   * A fully instantiated `RTMUser` is returned from a successful call to
   * `auth.getAuthToken()` after a user has authorized a `frob` via the
   * RTM website.
   * @param {string} id The RTM User's ID
   * @param {string} username The RTM User's username
   * @param {string} fullname The RTM User's full name
   * @param {string} [authToken] The RTM User's Auth Token
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
  }

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
    if ( !this._authToken ) {
      throw "User does not have Auth Token specified";
    }
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

   * Make an API request using the credentials of this RTM User
   * @param {string} method RTM API Method
   * @param {object} [params={}] RTM API Method Parameters
   * @param {function} callback {@link module:get~getCallback|getCallback} callback function
   * @see {@link module:get~get|get}
   */
  get(method, params, callback) {
    if ( callback === undefined && typeof params === 'function' ) {
      callback = params;
      params = {};
    }
    this.client.get(method, params, this, callback);
  }

  /**
   * Verify the Auth Token of this RTM User
   * @param {function} callback {@link module:auth~verifyAuthTokenCallback|verifyAuthTokenCallback} callback function
   * @see {@link module:auth~verifyAuthToken|verifyAuthToken}
   */
  verifyAuthToken(callback) {
    this.client.auth.verifyAuthToken(this.authToken, callback);
  }


  /**
   * RTM-List related functions
   * @see {@link RTMUser~lists/get|lists/get}
   * @see {@link RTMUser~lists/update|lists/update}
   * @see {@link RTMUser~lists/add|lists/add}
   * @see {@link RTMUser~lists/rename|lists/rename}
   * @see {@link RTMUser~lists/remove|lists/remove}
   * @returns {module}
   */
  get lists() {
    return lists(this);
  }

}


module.exports = RTMUser;
