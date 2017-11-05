'use strict';

const RTMUser = require('./user.js');
const sign = require('./utils/sign.js');

// API Configuration Properties
const config = require('../rtm.json');
const scheme = config.api.scheme;
const base = config.api.url.auth;


/**
 * ### RTM API Authentication
 *
 * This module provides functions that can be used to authenticate a user with
 * RTM and retrieve an authentication token that will be used with future API calls.
 *
 * See the project's `README` and documentation for an example on how to
 * authenticate a user and authorize a program to access a user's RTM account.
 *
 * **Note:** This module requires an `RTMClient` as an argument when loaded
 * separately via `require`.
 * ```
 * let client = new RTM(API_KEY, API_SECRET, RTM.PERM_DELETE);
 * const auth = require('./auth.js')(client);
 * ```
 * @module auth
 */
module.exports = function(client) {

  /**
   * Get the Authentication URL.
   *
   * This URL will prompt the RTM User to grant access to the program using
   * the API Key.
   * @param {function} callback {@link module:auth~authUrlCallback|authUrlCallback} callback function
   */
  function getAuthUrl(callback) {

    // Get a frob from the API Server
    _getFrob(function(err, frob) {
      if ( err ) {
        return callback(err);
      }

      // Build the AUTH URL
      let authUrl = _buildAuthURL(frob);

      // Return the Auth URL
      return callback(null, authUrl, frob);

    });

  }


  /**
   * Get the Authentication Token.
   *
   * This token will be used to authenticate all future RTM API requests on
   * behalf of the RTM User
   * @param {string} frob RTM Frob, from {@link getAuthUrl}
   * @param {function} callback {@link module:auth~authTokenCallback|authTokenCallback} callback function
   */
  function getAuthToken(frob, callback) {

    // Set request parameters
    let params = {
      frob: frob
    };

    // Get Auth Token
    client.get('rtm.auth.getToken', params, function(resp) {
      if ( !resp.isOk ) {
        return callback(resp);
      }
      let user = new RTMUser(
        resp.auth.user.id,
        resp.auth.user.username,
        resp.auth.user.fullname,
        resp.auth.token,
        client
      );
      return callback(null, user);
    });

  }


  /**
   * Verify the Authentication Token.
   *
   * This will check if the RTM User's authentication token is still valid
   * to make API requests.
   * @param {string|RTMUser} token RTM User Authentication Token or RTM User
   * @param {function} callback {@link module:auth~verifyAuthTokenCallback|verifyAuthTokenCallback} callback function
   */
   function verifyAuthToken(token, callback) {

     // Get token from RTMUser
     if ( typeof token === 'object' && token instanceof RTMUser ) {
       token = token.authToken;
     }

    // Set request parameters
    let params = {
      auth_token: token
    };

    // Verify Token
    client.get('rtm.auth.checkToken', params, function(resp) {
      return callback(resp.isOk);
    });

  }



  // ==== HELPER FUNCTIONS ==== //


  /**
   * Get RTM Authentication Frob
   * @param {function} callback Callback function(err, frob)
   * @private
   */
  function _getFrob(callback) {

    client.get('rtm.auth.getFrob', function(resp) {
      if ( !resp.isOk ) {
        return callback(resp);
      }
      return callback(null, resp.frob);
    });

  }

  /**
   * Build the Authentication URL to send to the User
   * @param {string} frob RTM Authentication Frob
   * @returns {string} RTM Auth URL
   * @private
   */
  function _buildAuthURL(frob) {

    // Build Request Parameters
    let params = {};
    params.api_key = client.key;
    params.perms = client.perms;
    params.frob = frob;
    params.api_sig = sign(params, client);

    // Form Query
    let query = _formQuery(params);

    // Build Auth URL
    return scheme + '://' + base + '?' + query;

  }

  /**
   * Generate a URI Encoded query string from the parameters set of key/value pairs
   * @param {object} params Object containing the key/value parameters
   * @returns {string} URL Encoded query string
   * @private
   */
  function _formQuery(params) {
    let parts = [];
    for ( let key in params ) {
      if ( params.hasOwnProperty(key) ) {
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
      }
    }
    return parts.join("&");
  }


  // EXPORT AUTH FUNCTIONS
  return {
    getAuthUrl: getAuthUrl,
    getAuthToken: getAuthToken,
    verifyAuthToken: verifyAuthToken
  }

};



// ==== CALLBACK FUNCTION DEFINITIONS ==== //

/**
 * This function is called after requesting an authentication url.  The callback
 * function will return the URL to be opened by the RTM User and the User's
 * `frob` which will be used to get an authentication token.
 * @callback module:auth~authUrlCallback
 * @param {RTMError} err RTM Error, if encountered
 * @param {string} authUrl RTM Authentication URL
 * @param {string} authFrob RTM Frob
 */

/**
 * This function is called after requesting an authentication token.  The callback
 * function will return an instance of {@link RTMUser} which will contain the
 * `authToken` and additional user information.
 * @callback module:auth~authTokenCallback
 * @param {RTMError} err RTM Error, if encountered
 * @param {RTMUser} user RTM User information
 */

/**
 * This function is called after verifying the user's authentication token.
 * The callback function will return the verification status.
 * @callback module:auth~verifyAuthTokenCallback
 * @param {boolean} verified True if the auth token was successfully verified
 */
