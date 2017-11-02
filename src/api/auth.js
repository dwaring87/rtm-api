'use strict';

/**
 * ### RTM API Authentication
 *
 * This module is used to authenticate a user with RTM and retrieve an
 * authentication token that will be used with future API calls.
 * @module api/auth
 */

const get = require('./get.js');
const sign = require('./sign.js');
const error = require('./response/error.js');

// API Configuration Properties
const config = require('../../rtm.json');
const scheme = config.api.scheme;
const base = config.api.url.auth;


// ==== CALLBACK FUNCTION DEFINITIONS ==== //

/**
 * This function is called after requesting an authentication url.  The callback
 * function will return the URL to be opened by the RTM User and the User's
 * `frob` which will be used to get an authentication token.
 * @callback module:api/auth~authUrlCallback
 * @param {RTMError} err RTM Error, if encountered
 * @param {string} authUrl RTM Authentication URL
 * @param {string} authFrob RTM Frob
 */

/**
 * This function is called after requesting an authentication token.  The callback
 * function will return the authentication token and the authenticated user's
 * information.
 * @callback module:api/auth~authTokenCallback
 * @param {RTMError} err RTM Error, if encountered
 * @param {string} token RTM Authentication Token
 * @param {object} user RTM User information
 * @param {string} user.id RTM User ID
 * @param {string} user.username RTM Username
 * @param {string} user.fullname RTM User Fullname
 */

/**
 * This function is called after verifying the user's authentication token.
 * The callback function will return the verification status.
 * @callback module:api/auth~verifyAuthTokenCallback
 * @param {boolean} verified True if the auth token was successfully verified
 */



// ==== AUTHENTICATION METHODS ==== //


/**
 * Get the Authentication URL.
 *
 * This URL will prompt the RTM User to grant access to the program using
 * the API Key.
 * @param {string} apiKey RTM API Key
 * @param {string} apiSecret RTM API Secret
 * @param {string} [perms=read] RTM API Permissions (read, write or delete)
 * @param {function} callback {@link module:api/auth~authUrlCallback|authUrlCallback} callback function
 */
function getAuthUrl(apiKey, apiSecret, perms, callback) {

  // Parse arguments
  if ( callback === undefined && typeof perms === 'function' ) {
    callback = perms;
    perms = 'read';
  }

  // Get a frob from the API Server
  _getFrob(apiKey, apiSecret, function(err, frob) {
    if ( err ) {
      return callback(err);
    }

    // Build the AUTH URL
    let authUrl = _buildAuthURL(apiKey, apiSecret, perms, frob);

    // Return the Auth URL
    return callback(null, authUrl, frob);

  });

}


/**
 * Get the Authentication Token.
 *
 * This token will be used to authenticate all future RTM API requests on
 * behalf of the RTM User
 * @param {string} apiKey RTM API Key
 * @param {string} apiSecret RTM API Secret
 * @param {string} frob RTM Frob, from {@link getAuthUrl}
 * @param {function} callback {@link module:api/auth~authTokenCallback|authTokenCallback} callback function
 */
function getAuthToken(apiKey, apiSecret, frob, callback) {

  // Set request parameters
  let params = {
    frob: frob
  };

  // Get Auth Token
  get('rtm.auth.getToken', apiKey, apiSecret, params, function(resp) {
    if ( !resp.isOk || !resp.has('auth.token') ) {
      return callback(error.authError('Could not get user auth token from API Server'));
    }
    return callback(null, resp.auth.token, resp.auth.user);
  });

}


/**
 * Verify the Authentication Token.
 *
 * This will check if the RTM User's authentication token is still valid
 * to make API requests.
 * @param {string} apiKey RTM API Key
 * @param {string} apiSecret RTM API Secret
 * @param {string} token RTM User Authentication Token
 * @param {function} callback {@link module:api/auth~verifyAuthTokenCallback|verifyAuthTokenCallback} callback function
 */
function verifyAuthToken(apiKey, apiSecret, token, callback) {

  // Set request parameters
  let params = {
    auth_token: token
  };

  // Verify Token
  get('rtm.auth.checkToken', apiKey, apiSecret, params, function(resp) {
    return callback(resp.isOk);
  });

}



// ==== HELPER FUNCTIONS ==== //


/**
 * Get RTM Authentication Frob
 * @param {string} apiKey RTM API Key
 * @param {string} apiSecret RTM API Secret
 * @param {function} callback Callback function(err, frob)
 * @private
 */
function _getFrob(apiKey, apiSecret, callback) {

  get('rtm.auth.getFrob', apiKey, apiSecret, function(resp) {
    if ( !resp.isOk || !resp.has('frob') ) {
      return callback(error.authError('Could not get user frob from RTM API Server'));
    }
    return callback(null, resp.frob);
  });

}

/**
 * Build the Authentication URL to send to the User
 * @param {string} apiKey RTM API Key
 * @param {string} apiSecret RTM API Secret
 * @param {string} perms RTM API Permissions
 * @param {string} frob RTM Authentication Frob
 * @returns {string} RTM Auth URL
 * @private
 */
function _buildAuthURL(apiKey, apiSecret, perms, frob) {

  // Build Request Parameters
  let params = {};
  params.api_key = apiKey;
  params.perms = perms;
  params.frob = frob;
  params.api_sig = sign(apiSecret, params);

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



module.exports = {
  getAuthUrl: getAuthUrl,
  getAuthToken: getAuthToken,
  verifyAuthToken: verifyAuthToken
};