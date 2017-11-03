'use strict';

/**
 * ### RTM API Authentication
 *
 * This module is used to authenticate a user with RTM and retrieve an
 * authentication token that will be used with future API calls.
 * @module request/auth
 */

const get = require('./get.js');
const sign = require('./sign.js');
const RTMUser = require('../user.js');

// API Configuration Properties
const config = require('../../rtm.json');
const scheme = config.api.scheme;
const base = config.api.url.auth;


// ==== CALLBACK FUNCTION DEFINITIONS ==== //

/**
 * This function is called after requesting an authentication url.  The callback
 * function will return the URL to be opened by the RTM User and the User's
 * `frob` which will be used to get an authentication token.
 * @callback module:request/auth~authUrlCallback
 * @param {RTMError} err RTM Error, if encountered
 * @param {string} authUrl RTM Authentication URL
 * @param {string} authFrob RTM Frob
 */

/**
 * This function is called after requesting an authentication token.  The callback
 * function will return the authentication token and the authenticated user's
 * information.
 * @callback module:request/auth~authTokenCallback
 * @param {RTMError} err RTM Error, if encountered
 * @param {RTMUser} user RTM User information
 */

/**
 * This function is called after verifying the user's authentication token.
 * The callback function will return the verification status.
 * @callback module:request/auth~verifyAuthTokenCallback
 * @param {boolean} verified True if the auth token was successfully verified
 */



// ==== AUTHENTICATION METHODS ==== //


/**
 * Get the Authentication URL.
 *
 * This URL will prompt the RTM User to grant access to the program using
 * the API Key.
 * @param {RTMClient} client The RTM Client making the request
 * @param {function} callback {@link module:request/auth~authUrlCallback|authUrlCallback} callback function
 */
function getAuthUrl(client, callback) {

  // Get a frob from the API Server
  _getFrob(client, function(err, frob) {
    if ( err ) {
      return callback(err);
    }

    // Build the AUTH URL
    let authUrl = _buildAuthURL(client, frob);

    // Return the Auth URL
    return callback(null, authUrl, frob);

  });

}


/**
 * Get the Authentication Token.
 *
 * This token will be used to authenticate all future RTM API requests on
 * behalf of the RTM User
 * @param {RTMClient} client The RTM Client making the request
 * @param {string} frob RTM Frob, from {@link getAuthUrl}
 * @param {function} callback {@link module:request/auth~authTokenCallback|authTokenCallback} callback function
 */
function getAuthToken(client, frob, callback) {

  // Set request parameters
  let params = {
    frob: frob
  };

  // Get Auth Token
  get('rtm.auth.getToken', client, params, function(resp) {
    if ( !resp.isOk ) {
      return callback(resp);
    }
    let user = new RTMUser(
      resp.auth.user.id,
      resp.auth.user.username,
      resp.auth.user.fullname,
      resp.auth.token
    );
    return callback(null, user);
  });

}


/**
 * Verify the Authentication Token.
 *
 * This will check if the RTM User's authentication token is still valid
 * to make API requests.
 * @param {RTMClient} client The RTM Client making the request
 * @param {string} token RTM User Authentication Token
 * @param {function} callback {@link module:request/auth~verifyAuthTokenCallback|verifyAuthTokenCallback} callback function
 */
function verifyAuthToken(client, token, callback) {

  // Set request parameters
  let params = {
    auth_token: token
  };

  // Verify Token
  get('rtm.auth.checkToken', client, params, function(resp) {
    return callback(resp.isOk);
  });

}



// ==== HELPER FUNCTIONS ==== //


/**
 * Get RTM Authentication Frob
 * @param {RTMClient} client The RTM Client making the request
 * @param {function} callback Callback function(err, frob)
 * @private
 */
function _getFrob(client, callback) {

  get('rtm.auth.getFrob', client, function(resp) {
    if ( !resp.isOk ) {
      return callback(resp);
    }
    return callback(null, resp.frob);
  });

}

/**
 * Build the Authentication URL to send to the User
 * @param {RTMClient} client The RTM Client making the request
 * @param {string} frob RTM Authentication Frob
 * @returns {string} RTM Auth URL
 * @private
 */
function _buildAuthURL(client, frob) {

  // Build Request Parameters
  let params = {};
  params.api_key = client.key;
  params.perms = client.perms;
  params.frob = frob;
  params.api_sig = sign(client, params);

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