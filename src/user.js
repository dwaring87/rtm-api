'use strict';

/**
 * @module user
 */

/**
 * ### RTM User
 *
 * This Class is used to represent an authorized RTM User.  The User contains
 * the user's ID, username and fullname as well as an auth token that can
 * be used in RTM API calls.
 * @class
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
   * @constructor
   */
  constructor(id, username, fullname, authToken) {
    this._id = id;
    this._username = username;
    this._fullname = fullname;
    this._authToken = authToken;
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

}


module.exports = RTMUser;
