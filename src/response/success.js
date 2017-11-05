'use strict';

const RTMResponse = require('./response.js');


/**
 * ### RTMSuccess
 * @see RTMSuccess
 * @module response/success
 */


/**
 * ### RTM Success Response
 *
 * This Class represents a successful response from the RTM API Server: the
 * RTM API Server returned a response with a status of 'ok'. This Class will
 * include all of the properties of the RTM `rsp` property.
 *
 * `RTMSuccess` extends {@link RTMResponse}
 *
 * **Module:** response/success
 * @class
 * @alias RTMSuccess
 */
class RTMSuccess extends RTMResponse {

  /**
   * Create a new RTM Success Response
   * @param {object} rsp The RTM API Response's `rsp` property
   * @constructor
   */
  constructor(rsp) {
    super(RTMResponse.STATUS_OK);

    // Parse the response properties
    for ( let key in rsp ) {
      if ( rsp.hasOwnProperty(key) && key !== 'stat' ) {
        this[key] = rsp[key];
      }
    }
  }

  /**
   * Get a String representation of the Success Response
   * @returns {string}
   */
  toString() {
    return super.toString() + " " + JSON.stringify(this.props);
  }

}


module.exports = RTMSuccess;