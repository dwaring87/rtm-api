'use strict';

/**
 * ### RTM API Signature
 *
 * This module is used to sign the RTM API requests given a set
 * of parameters and the RTM API shared secret.
 *
 * The parameters should be given as a single object with a set of
 * key/value pairs as the object's properties.  For example, the
 * parameters: `yxz=foo feg=bar abc=baz` should be given as on object
 * as:
 * ```
 * {
 *  yxz: "foo",
 *  feg: "bar",
 *  abc: "baz"
 * }
 * ```
 * @module api/sign
 */


const crypto = require('crypto');


/**
 * Sign the RTM API Request
 * @param {string} apiSecret RTM API Shared Secret
 * @param {object} params Request parameters
 * @return {string} RTM API Signature
 */
function sign(apiSecret, params) {

  // Sort the properties of the parameters
  params = _sort(params);

  // Concatenate the parameter's key/value pairs
  let cat = _concat(params);

  // Add to Shared Secret
  let toHash = apiSecret + cat;

  // Return the Hash
  return crypto.createHash('md5').update(toHash).digest("hex");

}


/**
 * Sort the properties of the Object alphabetically
 * @param {object} object Object to sort
 * @returns {object} Object with sorted properties
 * @private
 */
function _sort(object) {
  let keys = [];
  for ( let key in object ) {
    if ( object.hasOwnProperty(key) ) {
      keys.push(key);
    }
  }
  keys.sort();

  let rtn = {};
  for ( let i = 0; i < keys.length; i++ ) {
    let key = keys[i];
    rtn[key] = object[key];
  }
  return rtn;
}


/**
 * Concatenate the object's key/value pairs into a single string
 * @param {object} object The object whose properties will be concatenated
 * @returns {string} Concatenated key/value pairs
 * @private
 */
function _concat(object) {
  let rtn = "";
  for ( let key in object ) {
    if ( object.hasOwnProperty(key) ) {
      rtn += key + object[key];
    }
  }
  return rtn;
}


module.exports = sign;