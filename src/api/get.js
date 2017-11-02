'use strict';

/**
 * ### RTM API Request
 *
 * This module can be used to make a request to the RTM API Server.
 * @module api/get
 */

const URL = require('url');
const sign = require('./sign.js');
const parse = require('./response/index.js');
const error = require('./response/error.js');

// API Configuration Properties
const config = require('../../rtm.json');
const scheme = config.api.scheme;
const base = config.api.url.base;
const format = config.api.format;
const version = config.api.version;



// ==== CALLBACK DEFINITIONS ==== //

/**
 * This function will be called after the RTM API request has finished.  The
 * callback function will return a parsed response from the RTM API Server
 * and will be an instance of either {@link RTMResponse}, {@link RTMError}, or
 * {@link RTMSuccess}.
 * @callback module:api/get~getCallback
 * @param {RTMResponse|RTMError|RTMSuccess} response The parsed RTM API Response
 */



// ==== API REQUEST METHODS ==== //

/**
 * Make the specified RTM API call
 * @param {string} method RTM API Method
 * @param {string} apiKey RTM API Key
 * @param {string} apiSecret RTM API Secret
 * @param {object} [params] RTM Method Parameters (as an object with key/value pairs)
 * @param {function} callback {@link module:api/get~getCallback|getCallback} callback function
 */
function get(method, apiKey, apiSecret, params, callback) {

  // Check params and callback
  if ( callback === undefined && typeof params === 'function' ) {
    callback = params;
    params = {};
  }

  // Build the Request URL
  let requestUrl = _buildRequestUrl(method, apiKey, apiSecret, params);

  // Parse the URL
  let url = URL.parse(requestUrl);

  // Require the http(s) module
  let http = undefined;
  if ( scheme === "https" ) {
    http = require('https');
  }
  else {
    http = require('http');
  }

  // Build the request options
  let options = {
    host: url.host,
    path: url.path,
    method: 'GET'
  };

  // Make the Request
  let req = http.request(options, function(response) {
    let resp = '';
    response.on('data', function(chunk) {
      resp += chunk;
    });
    response.on('end', function() {
      let parsed = parse(resp);
      callback(parsed);
    });
  });
  req.on('error', function(err) {
    console.error(err);
    callback(error.networkError());
  });
  req.end();

}


/**
 * Build the API Request URL.
 *
 * This uses the properties in the `rtm.json` configuration file for the
 * URL scheme, base URL, format and version.  It will create a URL encoded
 * query string from the passed parameters and add a signature to the request.
 * @param {string} method RTM API Method
 * @param {string} apiKey RTM API Key
 * @param {string} apiSecret RTM API Secret
 * @param {Object} [params={}] Request Parameters
 * @returns {string} Signed Request URL
 * @private
 */
function _buildRequestUrl(method, apiKey, apiSecret, params={}) {

  // Add method, api key, version and format to params
  params.method = method;
  params.api_key = apiKey;
  params.version = version;
  params.format = format;
  params.api_sig = sign(apiSecret, params);

  // Generate query string from params
  let query = _formQuery(params);

  // Build the API request URL
  return scheme + '://' + base + "?" + query;

}


/**
 * Generate a URI Encoded query string from the parameters set of
 * key/value pairs
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


module.exports = get;