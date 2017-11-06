'use strict';

/**
 * Generate an index number of each item
 * @param {object[]} items List of Items
 * @param {string} [id='id'] Item property name to be used to generate the index
 * @param {string|boolean} [padding=' '] The character to use as the front
 * padding to make all indices the same length of characters.  If set to `false`
 * the index will not be padded and added as an integer.  Padded indices will
 * be added as a string.
 * @returns {*}
 * @private
 */
function genIndex(items, id='id', padding=' ') {
  let paddingChar = padding;
  if ( padding === false ) {
    paddingChar = '';
  }
  else if ( padding === true ) {
    paddingChar = ' ';
  }

  // Sort the items by the id
  items.sort(_sortFactory(id));

  // Add the index
  for ( let i = 0; i < items.length; i++ ) {
    let index = _getIndex(i+1, _digits(items.length), paddingChar);

    items[i]._index = index;
    if ( padding === false ) {
      items[i]._index = parseInt(index);
    }
  }

  // Return the list with indices added
  return items;

}

/**
 * Create the padded index
 * @param {int} index Index Number
 * @param {int} digits Number of Digits
 * @param {string} padding Padding Character
 * @returns {string}
 * @private
 */
function _getIndex(index, digits, padding) {
  let rtn = index.toString();
  let indexDigits = _digits(index);
  for ( let i = indexDigits; i < digits; i++ ) {
    rtn = padding + rtn;
  }
  return rtn;
}

/**
 * Create a sort function for the specified property
 * @param {string} property Property name
 * @returns {Function}
 * @private
 */
function _sortFactory(property) {
  return function(a, b) {
    let aProp = a[property];
    let bProp = b[property];
    if ( typeof aProp === 'string' ) {
      aProp = aProp.toLowerCase();
    }
    else if ( typeof bProp === 'string' ) {
      bProp = bProp.toLowerCase();
    }

    if ( aProp < bProp ) {
      return -1;
    }
    else if ( aProp > bProp ) {
      return 1;
    }
    else {
      return 0;
    }
  }
}

/**
 * Get the number of digits
 * @param {number} n Number
 * @returns {Number}
 * @private
 */
function _digits(n) {
  return n.toString().length;
}


module.exports = genIndex;