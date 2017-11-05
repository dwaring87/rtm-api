'use strict';

const user = require('./user.js');


/**
 * ### RTM Client
 * @see RTMClient
 * @module /
 */

/**
 * ### RTM Client
 *
 * This Class is used to represent an RTM API Client.  The Client contains
 * the API Key, API Secret and access permissions used to access the
 * RTM API.
 *
 * The `RTMClient` Class is what is exported when the entire `rtm-api` module
 * is loaded via `require`.
 *
 * Example:
 * ```
 * const RTM = require('rtm-api');
 * let client = new RTM(API_KEY, API_SECRET, RTM.PERM_DELETE);
 * ```
 *
 * An `RTMClient` instance also provides access to the main API helper functions.
 *
 * Auth Example:
 *
 * ```
 * client.auth.getAuthUrl(function(err, authUrl, frob) {
 *    // Have user authenticate and authorize the program with the authUrl
 *    // Once authorized by the user, use the frob to get an authToken
 * )};
 * ```
 *
 * To access any RTM API endpoint:
 *
 * ```
 * let user = ...   // from getAuthToken function
 * let params = {
 *    foo: 'bar'
 * }
 * client.get('rtm.method', params, user, function(resp) {
 *    if ( !resp.isOk ) {
 *      // handle error
 *    }
 *    // use the response
 * });
 * ```
 *
 * **Module:** /
 * @class
 * @alias RTMClient
 */
class RTMClient {

  /**
   * Create a new RTM Client with the specified API access information
   * @param {string} apiKey RTM API Key
   * @param {string} apiSecret RTM API Secret
   * @param {string} [perms=RTMClient.PERM_READ] RTM API Access Permissions. This
   * should be one of {@link RTMClient.PERM_READ}, {@link RTMClient.PERM_WRITE} or
   * {@link RTMClient.PERM_DELETE}.
   * @constructor
   */
  constructor(apiKey, apiSecret, perms=RTMClient.PERM_READ) {
    this._apiKey = apiKey;
    this._apiSecret = apiSecret;
    this._perms = perms;
  }


  /**
   * RTM API Key
   * @returns {string}
   */
  get key() {
    return this._apiKey;
  }

  /**
   * RTM API Secret
   * @returns {string}
   */
  get secret() {
    return this._apiSecret;
  }

  /**
   * RTM API Access Permissions
   * @returns {string}
   */
  get perms() {
    return this._perms;
  }


  /**
   * Make a RTM-API request
   * @see {@link module:get|get}
   * @returns {function}
   */
  get get() {
    return require('./get.js')(this);
  }

  /**
   * Auth-related functions: `getAuthUrl`, `getAuthToken` and `verifyAuthToken`
   * @see {@link module:auth|auth}
   * @returns {{getAuthUrl, getAuthToken, verifyAuthToken}}
   */
  get auth() {
    return require('./auth.js')(this);
  }

}


/**
 * Create a new `RTMUser` manually
 * @type {RTMUser}
 */
RTMClient.user = user;



// ==== RTM API PERMISSION LEVELS ==== //

/**
 * RTM API Access: `read` -
 * gives the ability to read task, contact, group and list details and contents.
 * @type {string}
 * @default
 */
RTMClient.PERM_READ = 'read';

/**
 * RTM API Access: `write` -
 * gives the ability to add and modify task, contact, group and list details and
 * contents (also allows you to `read`).
 * @type {string}
 * @default
 */
RTMClient.PERM_WRITE = 'write';

/**
 * RTM API Access: `delete` -
 * gives the ability to delete tasks, contacts, groups and lists (also allows
 * you to `read` and `write`).
 * @type {string}
 * @default
 */
RTMClient.PERM_DELETE = 'delete';



module.exports = RTMClient;
