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

    // List indices are set after construction
    this._index = undefined;

    /**
     * List ID
     * @type {Number}
     */
    this.id = parseFloat(props.id);

    /**
     * List Name
     * @type {string}
     */
    this.name = props.name;

    /**
     * List Deleted Flag
     * @type {boolean}
     */
    this.deleted = props.deleted.toString() === '1';

    /**
     * List Locked Flag
     * @type {boolean}
     */
    this.locked = props.locked.toString() === '1';

    /**
     * List Archived Flag
     * @type {boolean}
     */
    this.archived = props.archived.toString() === '1';

    /**
     * List Position
     * @type {Number}
     */
    this.position = parseInt(props.position);

    /**
     * Smart List Flag
     * @type {boolean}
     */
    this.smart = props.smart.toString() === '1';

    /**
     * List Sort Order
     * @type {Number}
     */
    this.sort_order = parseInt(props.sort_order);

  }

  /**
   * An index added to each RTM List based on its `id`
   * @type {int}
   */
  get index() {
    return this._index;
  }

  /**
   * All of the RTM List properties
   * @type {object}
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


module.exports = RTMList;