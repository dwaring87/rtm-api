'use strict';

/**
 * ### RTM Generic Response
 *
 * This Class represents a generic Response from the RTM API Server.
 * The `RTMError` and `RTMSuccess` Classes represent the actual failed
 * and successful responses from the RTM API Server.
 *
 * This Class is extended by the {@link RTMSuccess} and {@link RTMError} Classes.
 * @class
 * @alias RTMResponse
 */
class RTMResponse {

  /**
   * Create a new Generic RTM Response with a status of either
   * {@link RTMResponse.STATUS_OK} or {@link RTMResponse.STATUS_FAIL}.
   * @param {string} status RTM API Status
   * @constructor
   */
  constructor(status) {
    this._status = status;
  }

  /**
   * The RTM Response Status
   * @type {string}
   */
  get status() {
    return this._status;
  }

  /**
   * The success of the RTM Response (ie, is `true` when status is 'ok')
   * @type {boolean}
   */
  get isOk() {
    return this._status === RTMResponse.STATUS_OK;
  }

  /**
   * The RTM API properties of the Response
   * @type {object}
   */
  get props() {
    let rtn = {};
    for ( let key in this ) {
      if ( this.hasOwnProperty(key) && key !== '_status' ) {
        rtn[key] = this[key];
      }
    }
    return rtn;
  }

  /**
   * Check if the Response has the specified property
   * @param {string} property Property Name
   * @returns {boolean}
   */
  has(property) {
    let parts = property.split('.');
    let object = this;

    for ( let i = 0; i < parts.length; i++ ) {
      object = object[parts[i]];
      if ( object === undefined ) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get a String representation of the Response
   * @returns {string}
   */
  toString() {
    return "[" + this._status + "]";
  }

}


/**
 * RTM Status of 'ok' = successful
 * @type {string}
 * @default
 */
RTMResponse.STATUS_OK = "ok";

/**
 * RTM Status of 'fail' = error
 * @type {string}
 * @default
 */
RTMResponse.STATUS_FAIL = "fail";



module.exports = RTMResponse;