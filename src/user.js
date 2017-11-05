'use strict';

/**
 * ### RTMUser
 * @see RTMUser
 * @module user
 */

/**
 * ### RTM User
 *
 * This Class is used to represent an authorized RTM User.  The User contains
 * the user's ID, username and fullname as well as an auth token that can
 * be used in RTM API calls.
 *
 * **Module:** user
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
   * @param {string} authToken The RTM User's Auth Token
   * @param {RTMClient} client The RTM Client that authorized this User
   * @constructor
   */
  constructor(id, username, fullname, authToken, client) {
    this._id = id;
    this._username = username;
    this._fullname = fullname;
    this._authToken = authToken;
    this._client = client;
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
    return this._authToken;
  }

  /**
   * Set the RTM User Auth Token
   * @param {string} token
   */
  set authToken(token) {
    this._authToken = token;
  }


  /**
   * The Client that authorized this User
   * @returns {RTMClient}
   */
  get client() {
    return this._client;
  }

  /**
   * Set the Client that authorized this User
   * @param {RTMClient} client
   */
  set client(client) {
    this._client = client;
  }

  /**
   * Make an API request using the credentials of this RTM User
   * @param {string} method RTM API Method
   * @param {object} [params={}] RTM API Method Parameters
   * @param {function} callback {@link module:get~getCallback|getCallback} callback function
   */
  get(method, params, callback) {
    if ( !this.client ) {
      throw "User does not have client specified";
    }

    // Check params
    if ( callback === undefined && typeof params === 'function' ) {
      callback = params;
      params = {};
    }

    // Call the main get() function
    let _get = require('./get.js')(this.client);
    _get(method, params, this, callback);
  }

}


module.exports = RTMUser;
