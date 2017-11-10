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
 * @alias RTMError
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
   * The RTM Error Code
   * @returns {number}
   */
  get code() {
    return this._code;
  }

  /**
   * The RTM Error Message
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
    return super.toString() + " ERROR " + this._code + ": " + this._msg;
  }

}


// === CUSTOM ERRORS ==== //

/**
 * Create a new `RTMError` that represents a network error.
 *
 * Error Code: `-1`
 * @returns {RTMError}
 */
RTMError.networkError = function() {
  return new RTMError(-1, "Network Error: Could not make request to RTM API Server");
};

/**
 * Create a new `RTMError` that represents an API response error.
 *
 * Error Code: `-2`
 * @returns {RTMError}
 */
RTMError.responseError = function() {
  return new RTMError(-2, "Response Error: Could not parse the response from the RTM API Server");
};

/**
 * Create a new `RTMError` that represents an index error (ie, task index is out
 * of range).
 *
 * Error Code: `-3`
 * @returns {RTMError}
 */
RTMError.indexError = function() {
  return new RTMError(-3, "Index Error: Could not find item by reference index number");
};

module.exports = RTMError;