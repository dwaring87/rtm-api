'use strict';

const errors = require('../response/error.js');
const _lists = require('../list/helper.js');


/**
 * This module returns the RTM list-related functions for the RTMUser
 * @param {RTMUser} user RTM User instance
 * @returns {{get: function, update: function, add: function, remove: function, rename: function}}
 * @private
 */
module.exports = function(user) {
  let rtn = {};

  /**
   * Get the list of RTM Lists for this User from the API Server
   * @param {function} callback Callback function(err, lists)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @param {RTMList[]} callback.lists List of User's RTM Lists
   * @function RTMUser~lists/get
   */
  rtn.get = function(callback) {
    _lists.get(user, callback);
  };

  /**
   * Add a new RTM List for this User
   * @param {string} name Name of the new RTM List
   * @param {string} [filter] Smart List Filter
   * @param {function} callback Callback function(err, lists)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~lists/add
   */
  rtn.add = function(name, filter, callback) {
    if ( callback === undefined && typeof filter === 'function' ) {
      callback = filter;
      filter = undefined;
    }
    _lists.add(name, filter, user, callback);
  };

  /**
   * Remove the specified RTM List for this User
   * @param {string} name RTM List Name
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~lists/remove
   */
  rtn.remove = function(name, callback) {

    // Get the User's Lists
    _lists.get(user, function(err, lists) {
      if ( err ) {
        return callback(err);
      }

      // Find the matching list IDs
      let ids = [];
      for ( let i = 0; i < lists.length; i++ ) {
        if ( lists[i].name.toLowerCase() === name.toLowerCase() ) {
          ids.push(lists[i].id);
        }
      }

      // Remove the matching List
      if ( ids.length === 1 ) {
        return _lists.remove(ids[0], user, callback);
      }
      else {
        return callback(errors.referenceError());
      }

    });

  };

  /**
   * Rename the specified RTM List for this User
   * @param {string} oldName Old RTM List Name
   * @param {string} newName New RTM List name
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~lists/rename
   */
  rtn.rename = function(oldName, newName, callback) {

    // Get the User's Lists
    _lists.get(user, function(err, lists) {
      if ( err ) {
        return callback(err);
      }

      // Find the matching list IDs
      let ids = [];
      for ( let i = 0; i < lists.length; i++ ) {
        if ( lists[i].name.toLowerCase() === oldName.toLowerCase() ) {
          ids.push(lists[i].id);
        }
      }

      // Rename the matching List
      if ( ids.length === 1 ) {
        return _lists.rename(ids[0], newName, user, callback);
      }
      else {
        return callback(errors.referenceError());
      }

    });

  };

  return rtn;
};