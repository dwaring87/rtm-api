'use strict';

const RTMResponse = require('./response.js');


/**
 * ### RTM Error Response
 *
 * This Class represents a failed request to the RTM API Server: the
 * RTM API Server returned a response with a status of 'fail'.  This
 * Class will include the error code and error message from the
 * response.
 *
 * `RTMError` extends {@link RTMResponse}
 * @class
 */
class RTMError extends RTMResponse{

  /**
   * Create a new RTM Error Response
   * @param {number} code Error Code
   * @param {string} msg Error Message
   * @constructor
   */
  constructor(code, msg) {
    super(RTMResponse.STATUS_FAIL);
    this._code = code;
    this._msg = msg;
  }

  /**
   * Get the Error Code
   * @returns {number}
   */
  get code() {
    return this._code;
  }

  /**
   * Get the Error Message
   * @returns {string}
   */
  get msg() {
    return this._msg;
  }

  /**
   * Get a String representation of the Error
   * @returns {string}
   */
  toString() {
    return "ERROR " + this._code + ": " + this._msg;
  }

}


// === CUSTOM ERRORS ==== //

/**
 * Create a new `RTMError` that represents a network error
 * @returns {RTMError}
 */
RTMError.networkError = function() {
  return new RTMError(-1, "Network Error: Could not make request to RTM API Server");
};

/**
 * Create a new `RTMError` that represents an API response error
 * @returns {RTMError}
 */
RTMError.responseError = function() {
  return new RTMError(-2, "Response Error: Could not parse the response from the RTM API Server");
};

/**
 * Create a new `RTMError` that represents an API Authentication error
 * @param {string} [details] Additional error details
 * @returns {RTMError}
 */
RTMError.authError = function(details="Could not authenticate user") {
  return new RTMError(-3, "Authentication Error: " + details);
};


module.exports = RTMError;