'use strict';

const errors = require('../response/error.js');
const helper = require('./helper.js');

/**
 * User-specific RTM-List related functions
 * @param user
 * @returns {{}}
 */
module.exports = function(user) {
  let module = {};

  /**
   * Get the stored list of RTM Lists for this User.
   *
   * Note: {@link RTMUser~lists/update|lists/update()} needs to be called first.
   * @returns {RTMList[]}
   * @function RTMUser~lists/get
   */
  module.get = function() {
    return user._lists;
  };

  /**
   * Update the list of RTM Lists for this User
   * @param {function} callback Callback function(err, lists)
   * @param {RTMError} callback.err RTM API Error Response
   * @param {RTMList[]} callback.lists List of User's RTM Lists
   * @function RTMUser~lists/update
   */
  module.update = function(callback) {
    helper.get(user, callback);
  };

  /**
   * Add a new RTM List for this User
   * @param {string} name Name of the new RTM List
   * @param {function} callback Callback function(err, lists)
   * @param {RTMError} callback.err RTM API Error Response
   * @param {RTMList[]} callback.lists List of User's RTM Lists
   * @function RTMUser~lists/add
   */
  module.add = function(name, callback) {
    helper.add(name, user, callback);
  };

  /**
   * Remove the specified RTM List for this User
   * @param {int} index RTM List index
   * @param {function} callback Callback function(err, lists)
   * @param {RTMError} callback.err RTM API Error Response
   * @param {RTMList[]} callback.lists List of User's RTM Lists
   * @function RTMUser~lists/remove
   */
  module.remove = function(index, callback) {
    if ( user._lists ) {
      for ( let i = 0; i < user._lists.length; i++ ) {
        if ( user._lists[i].index === index ) {
          return helper.remove(user._lists[i].id, user, callback);
        }
      }
    }
    return callback(errors.indexError());
  };

  /**
   * Rename the specified RTM List for this User
   * @param {int} index RTM List index
   * @param {string} name New RTM List name
   * @param {function} callback Callback function(err, lists)
   * @param {RTMError} callback.err RTM API Error Response
   * @param {RTMList[]} callback.lists List of User's RTM Lists
   * @function RTMUser~lists/rename
   */
  module.rename = function(index, name, callback) {
    if ( user._lists ) {
      for ( let i = 0; i < user._lists.length; i++ ) {
        if ( user._lists[i].index === index ) {
          return helper.rename(user._lists[i].id, name, user, callback);
        }
      }
    }
    return callback(errors.indexError());
  };


  return module;
};