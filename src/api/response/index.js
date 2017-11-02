'use strict';

/**
 * ### RTM API Response
 *
 * Parse the RTM API Response into either a {@link RTMSuccess} or
 * {@link RTMError} Class.
 * @module api/response/
 */


const success = require('./success.js');
const error = require('./error.js');


/**
 * Parse the raw RTM API Response into either a `RTMSuccess` or
 * `RTMError` Class with the Response's properties.
 * @param {string} raw Raw RTM API Server Response (as a JSON-formatted String)
 * @returns {RTMError|RTMSuccess}
 */
function parse(raw) {

  // Parse the response into JSON
  let response = undefined;
  try {
    response = JSON.parse(raw);
  }
  catch(exception) {
    return error.responseError();
  }

  // Make sure there is a response status
  if ( !response || !response.rsp || !response.rsp.stat ) {
    return error.responseError();
  }

  // Get the response status
  let status = response.rsp.stat;

  // SUCCESS
  if ( status === 'ok' ) {
    return new success(response.rsp);
  }

  // ERROR
  else if ( status === 'fail' ) {
    return new error(response.rsp.err.code, response.rsp.err.msg);
  }

  // UNKNOWN STATUS
  else {
    return error.responseError();
  }

}


module.exports = parse;