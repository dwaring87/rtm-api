'use strict';

/**
 * Generate an index number of each item
 * @param {object[]} items List of Items
 * @param {string} [id='id'] Item property name to be used to generate the index
 * @returns {object[]} items with index added
 * @private
 */
function genIndex(items, id='id') {

  // Sort the items by the id
  items.sort(_sortFactory(id));

  // Add the index
  for ( let i = 0; i < items.length; i++ ) {
    items[i]._index = i+1;
  }

  // Return the list with indices added
  return items;

}


/**
 * Create a sort function for the specified property
 * @param {string} property Property name
 * @returns {function}
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


module.exports = genIndex;