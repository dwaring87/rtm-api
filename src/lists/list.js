'use strict';


/**
 * ### RTM List
 *
 * This Class is used to represent the properties of an RTM List.
 *
 * All of the list properties from RTM are directly accessible from this Class.
 *
 * ```
 * let list = new RTMList(...);
 * let name = list.name;
 * ```
 * @class
 */
class RTMList {

  /**
   * Create a new RTM List
   * @param {object} props The properties from the RTM API response `resp.lists.list`
   */
  constructor(props) {
    this._index = undefined;
    this.id = undefined;
    this.name = undefined;

    // Parse the list properties
    for ( let key in props ) {
      if ( props.hasOwnProperty(key) ) {
        let value = props[key];
        if ( key === 'id' ) {
          value = parseFloat(value);
        }
        else if ( key === 'position' || key === 'sort_order' ) {
          value = parseInt(value);
        }
        else if ( key === 'deleted' || key === 'locked' || key === 'archived' || key === 'smart' ) {
          value = value === '1';
        }
        this[key] = value;
      }
    }

  }

  /**
   * An index added to each RTM List based on its `id`
   * @returns {int}
   */
  get index() {
    return this._index;
  }

  /**
   * All of the RTM List properties
   * @returns {object}
   */
  get props() {
    let rtn = {};
    for ( let key in this ) {
      if ( this.hasOwnProperty(key) && key !== '_index' ) {
        rtn[key] = this[key];
      }
    }
    return rtn;
  }

}





// ==== SORT FUNCTIONS ==== //


/**
 * Sort the RTM Lists by the rtm-api added index field
 * @param {RTMList} a RTM List a
 * @param {RTMList} b RTM List b
 * @returns {number}
 */
RTMList.sortByIndex = function(a, b) {
  if ( parseInt(a.index) < parseInt(b.index) ) {
    return -1;
  }
  else if ( parseInt(a.index) > parseInt(b.index) ) {
    return 1;
  }
  else {
    return 0;
  }
};


/**
 * Sort the RTM Lists by the RTM List id
 * @param {RTMList} a RTM List a
 * @param {RTMList} b RTM List b
 * @returns {number}
 */
RTMList.sortById = function(a, b) {
  if ( a.id < b.id ) {
    return -1;
  }
  else if ( a.id > b.id ) {
    return 1;
  }
  else {
    return 0;
  }
};


/**
 * Sort the RTM Lists by the RTM List name
 * @param {RTMList} a RTM List a
 * @param {RTMList} b RTM List b
 * @returns {number}
 */
RTMList.sortByName = function(a, b) {
  if ( a.name.toLowerCase() < b.name.toLowerCase() ) {
    return -1;
  }
  else if ( a.name.toLowerCase() > b.name.toLowerCase() ) {
    return 1;
  }
  else {
    return 0;
  }
};


module.exports = RTMList;