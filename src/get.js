'use strict';

const URL = require('url');

const parse = require('./response/parse.js');
const error = require('./response/error.js');
const RTMUser = require('./user.js');
const sign = require('./utils/sign.js');

// API Configuration Properties
const config = require('../rtm.json');
const scheme = config.api.scheme;
const base = config.api.url.base;
const format = config.api.format;
const version = config.api.version;


/**
 * ### RTM API Request
 *
 * This module provides the `get` function which can be used to make a general
 * request to the RTM API Server.  The `get` function requires at least a
 * [RTM API method name](https://www.rememberthemilk.com/services/api/methods.rtm)
 * (such as 'rtm.tasks.getList') and a {@link getCallback} callback function.
 *
 * If the RTM API method requires any parameters, they should be provided as
 * an Object of key/value pairs.  For example, the parameters abc=foo and xyz=bar
 * should be provided as:
 * ```
 * {
 *    abc: "foo",
 *    xyz: "bar"
 * }
 * ```
 *
 * Most RTM API requests will require an authToken of an authenticated User who
 * has authorized the RTM API Client access to their account.  This can be provided
 * manually as an `auth_token` parameter or the `get` method will accept an
 * `RTMUser` instance (which can be obtained via the `getAuthToken` function) which
 * will provide the necessary authToken.
 *
 * **Note:** This module requires an `RTMClient` as an argument when loaded
 * separately via `require`.
 * ```
 * let client = new RTM(API_KEY, API_SECRET, RTM.PERM_DELETE);
 * const get = require('./get.js')(client);
 * ```
 * @module get
 */
module.exports = function(client) {

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
   * @param {object} [params={}] RTM Method Parameters (as an object with key/value pairs)
   * @param {RTMUser} [user=undefined] The RTM User making the request
   * @param {function} callback {@link module:get~getCallback|getCallback} callback function
   */
  function get(method, params, user, callback) {

    // Parse the given arguments
    let args = _parseGetArgs(method, params, user, callback);

    // Build the Request URL
    let requestUrl = _buildRequestUrl(args.method, args.params, args.user);

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
        args.callback(parsed);
      });
    });
    req.on('error', function() {
      args.callback(error.networkError());
    });
    req.end();

  }


  /**
   * Parse the arguments given to the get() function
   * @returns {{method: *, params: *, user: *, callback: *}}
   * @private
   */
  function _parseGetArgs() {

    // Parsed arguments to return
    let rtn = {};
    rtn.params = {};

    // Parse each of the arguments
    for ( let key in arguments ) {
      if ( arguments.hasOwnProperty(key) ) {
        let arg = arguments[key];
        if ( typeof arg === 'string' ) {
          rtn.method = arg;
        }
        else if ( typeof arg === 'function' ) {
          rtn.callback = arg;
        }
        else if ( typeof arg === 'object' ) {
          if ( arg instanceof RTMUser ) {
            rtn.user = arg;
          }
          else {
            rtn.params = arg;
          }
        }
      }
    }

    // Return the parsed arguments
    return rtn;

  }



  /**
   * Build the API Request URL.
   *
   * This uses the properties in the `rtm.json` configuration file for the
   * URL scheme, base URL, format and version.  It will create a URL encoded
   * query string from the passed parameters and add a signature to the request.
   * @param {string} method RTM API Method
   * @param {Object} [params={}] Request Parameters
   * @param {RTMUser} [user=undefined] The RTM User making the request
   * @returns {string} Signed Request URL
   * @private
   */
  function _buildRequestUrl(method, params, user) {

    // Parse the given arguments
    let args = _parseBuildRequestUrlArgs(method, params, user);

    // Add User Auth Token, if provided
    if ( args.user && args.user.authToken ) {
      args.params.auth_token = args.user.authToken;
    }

    // Add method, api key, version and format to params
    args.params.method = args.method;
    args.params.api_key = client.key;
    args.params.version = version;
    args.params.format = format;
    args.params.api_sig = sign(args.params, client);

    // Generate query string from params
    let query = _formQuery(args.params);

    // Build the API request URL
    return scheme + '://' + base + "?" + query;

  }


  /**
   * Parse the arguments given to the _buildRequestUrl function
   * @returns {{method: *, params: *, user: *}}
   * @private
   */
  function _parseBuildRequestUrlArgs() {

    // Parsed arguments to return
    let rtn = {};
    rtn.params = {};

    // Parse each of the arguments
    for ( let key in arguments ) {
      if ( arguments.hasOwnProperty(key) ) {
        let arg = arguments[key];
        if ( typeof arg === 'string' ) {
          rtn.method = arg;
        }
        else if ( typeof arg === 'object' ) {
          if ( arg instanceof RTMUser ) {
            rtn.user = arg;
          }
          else {
            rtn.params = arg;
          }
        }
      }
    }

    // Return the parsed arguments
    return rtn;

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



  // EXPORT THE get() FUNCTION
  return get;
};





// ==== CALLBACK FUNCTION DEFINITIONS ==== //


/**
 * This function will be called after the RTM API request has finished.  The
 * callback function will return a parsed response from the RTM API Server
 * and will be an instance of either {@link RTMResponse}, {@link RTMError}, or
 * {@link RTMSuccess}.
 * @callback module:get~getCallback
 * @param {RTMResponse|RTMError|RTMSuccess} response The parsed RTM API Response
 */