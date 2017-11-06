'use strict';


/**
 * Get the Item referenced by the specified item index
 * @param {int} index Item index number
 * @param {object[]} items List of items to search
 * @returns {*}
 * @private
 */
function findIndex(index, items) {
  index = parseInt(index);
  for ( let i = 0; i < items.length; i++ ) {
    let item = items[i];
    let _index = parseInt(item.index);
    if ( _index === index ) {
      return item;
    }
  }
  return undefined;
}


module.exports = findIndex;