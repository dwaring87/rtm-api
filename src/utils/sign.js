'use strict';

const crypto = require('crypto');


/**
 * ### RTM API Signature
 *
 * This module provides the `sign()` function which can be used to sign the RTM
 * API requests for a given set of parameters and `RTMClient`.
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
 * @module utils/sign
 * @private
 */


/**
 * Sign the RTM API Request
 * @param {object} params Request parameters
 * @param {RTMClient} client The RTM Client making the request
 * @return {string} RTM API Signature
 * @private
 */
function sign(params, client) {

  // Sort the properties of the parameters
  params = _sort(params);

  // Concatenate the parameter's key/value pairs
  let cat = _concat(params);

  // Add to Shared Secret
  let toHash = client.secret + cat;

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