'use strict';


/**
 * ### RTM API Client
 *
 * This Class is used to represent an RTM API Client.  The Client contains
 * the API Key, API Secret and access permissions used to access the
 * RTM API endpoints.
 *
 * It also includes API wrapper functions for making a general RTM API request
 * as well as the auth-related functions.
 *
 * #### Usage
 *
 * The `RTMClient` Class is what is exported when the entire `rtm-api` module
 * is loaded via `require`.
 *
 * ```
 * const RTM = require('rtm-api');
 * let client = new RTM(API_KEY, API_SECRET, RTM.PERM_DELETE);
 * ```
 *
 * #### Auth Example
 *
 * This example gets an Auth URL to be opened by the RTM User
 *
 * ```
 * client.auth.getAuthUrl(function(err, authUrl, frob) {
 *    // Have user authenticate and authorize the program with the authUrl
 *    // Once authorized by the user, use the frob to get an authToken
 * )};
 * ```
 *
 * #### RTM API Example
 *
 * This example makes an RTM API request using the method `rtm.method` and the
 * parameter foo=bar.
 *
 * ```
 * client.get('rtm.method', {foo: "bar"}, function(resp) {
 *    if ( !resp.isOk ) {
 *      // handle error
 *    }
 *    // use the response
 * });
 * ```
 *
 * See {@link RTMUser#get|RTMUser.get} for making User-authenticated API requests.
 *
 * @class
 */
class RTMClient {

  /**
   * Create a new RTM Client with the specified API access information
   * @param {string} key RTM API Client Key
   * @param {string} secret RTM API Client Secret
   * @param {string} [perms=RTMClient.PERM_READ] RTM API Client Access Permissions. This
   * should be one of {@link RTMClient.PERM_READ}, {@link RTMClient.PERM_WRITE} or
   * {@link RTMClient.PERM_DELETE}.
   * @constructor
   */
  constructor(key, secret, perms=RTMClient.PERM_READ) {
    this._apiKey = key;
    this._apiSecret = secret;
    this._perms = perms;
  }


  /**
   * RTM API Client Key
   * @type {string}
   */
  get key() {
    return this._apiKey;
  }

  /**
   * RTM API Client Secret
   * @type {string}
   */
  get secret() {
    return this._apiSecret;
  }

  /**
   * RTM API Client Access Permissions
   * @type {string}
   */
  get perms() {
    return this._perms;
  }



  // ===== USER FUNCTIONS ===== //

  /**
   * User export/import-related functions:
   * - {@link RTMClient~user/create|create}
   * - {@link RTMClient~user/export|export}
   * - {@link RTMClient~user/exportToString|exportToString}
   * - {@link RTMClient~user/import|import}
   * - {@link RTMClient~user/importFromString|importFromString}
   * @returns {{create: function, export: function, exportToString: function, import: function, importFromString: function}}
   */
  get user() {
    return require('./user.js')(this);
  }



  // ===== API HELPER FUNCTIONS ===== //


  /**
   * Make the specified RTM API call.
   *
   * The `method` should be the name of the RTM API method.  Any necessary
   * parameters should be provided with `params` as an object with the properties
   * of the object as the parameters' key/value pairs.
   *
   * RTM API methods that require an AuthToken should set the `params` `auth_token`
   * property or provide a valid `RTMUser` with an AuthToken.
   * @param {string} method RTM API Method
   * @param {object} [params] RTM Method Parameters (as an object with key/value pairs)
   * @param {RTMUser} [user=undefined] The RTM User making the request
   * @param {function} callback Callback function(err, resp)
   * @param {RTMError} callback.err RTMError, if encountered
   * @param {RTMSuccess} callback.resp The parsed RTM API Response
   */
  get(method, params, user, callback) {
    require('../utils/get.js')(method, params, user, this, callback);
  }

  /**
   * Auth-related functions:
   * - {@link RTMClient~auth/getAuthUrl|getAuthUrl}
   * - {@link RTMClient~auth/getAuthToken|getAuthToken}
   * - {@link RTMClient~auth/verifyAuthToken|verifyAuthToken}
   * @returns {{getAuthUrl: function, getAuthToken: function, verifyAuthToken: function}}
   */
  get auth() {
    return require('./auth.js')(this);
  }

}



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
 * gives the ability to delete task, contacts, groups and list (also allows
 * you to `read` and `write`).
 * @type {string}
 * @default
 */
RTMClient.PERM_DELETE = 'delete';



module.exports = RTMClient;
