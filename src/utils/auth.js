'use strict';

const RTMUser = require('../user/index.js');
const sign = require('./sign.js');

// API Configuration Properties
const config = require('../../rtm.json');
const scheme = config.api.scheme;
const base = config.api.url.auth;


/**
 * Get Auth URL
 * @param {RTMClient} client RTM Client making the request
 * @param {function} callback Callback function(err, authUrl, frob)
 * @private
 */
function getAuthUrl(client, callback) {

  // Get a frob from the API Server
  _getFrob(client, function(err, frob) {
    if ( err ) {
      return callback(err);
    }

    // Build the AUTH URL
    let authUrl = _buildAuthURL(frob, client);

    // Return the Auth URL
    return callback(null, authUrl, frob);

  });

}


/**
 * Get Auth Token
 * @param {string} frob RTM Frob, from {@link getAuthUrl}
 * @param {RTMClient} client RTM Client making the request
 * @param {function} callback Callback function(err, user)
 * @private
 */
function getAuthToken(frob, client, callback) {

  // Set request parameters
  let params = {
    frob: frob
  };

  // Get Auth Token
  client.get('rtm.auth.getToken', params, function(resp) {
    if ( !resp.isOk ) {
      return callback(resp);
    }

    // Create new RTMUser
    let user = client.user.create(
      resp.auth.user.id,
      resp.auth.user.username,
      resp.auth.user.fullname,
      resp.auth.token
    );

    // Get a new Timeline for the User
    user.get('rtm.timelines.create', function(resp) {
      if ( !resp.isOk ) {
        return callback(resp);
      }

      // Set the User's Timeline
      user.timeline = resp.timeline;

      return callback(null, user);
    });

  });

}


/**
 * Verify Auth Token
 * @param {string|RTMUser} token RTM User Authentication Token or RTM User
 * @param {RTMClient} client RTM Client making the request
 * @param {function} callback Callback function(verified)
 * @private
 */
 function verifyAuthToken(token, client, callback) {

   // Get token from RTMUser
   if ( typeof token === 'object' ) {
     if ( token.constructor.name === 'RTMUser' ) {
       token = token.authToken;
     }
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
 * @param {RTMClient} client RTM Client making the request
 * @param {function} callback Callback function(err, frob)
 * @private
 */
function _getFrob(client, callback) {

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
 * @param {RTMClient} client RTM Client making the request
 * @returns {string} RTM Auth URL
 * @private
 */
function _buildAuthURL(frob, client) {

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



module.exports = {
  getAuthUrl: getAuthUrl,
  getAuthToken: getAuthToken,
  verifyAuthToken: verifyAuthToken
};
