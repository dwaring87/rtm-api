'use strict';

const _tasks = require('../task/helper.js');
const _lists = require('../list/helper.js');

/**
 * This module returns the RTM Tasks-related functions for the RTMUser
 * @param {RTMUser} user The RTM User instance
 * @returns {{get: function, update: function, add: function}}
 * @private
 */
module.exports = function(user) {
  let rtn = {};

  /**
   * Get the stored list of RTM Tasks for this User.
   *
   * Note: {@link RTMUser~tasks/update|tasks/update()} needs to be called first.
   * @returns {RTMTask[]}
   * @function RTMUser~tasks/get
   */
  rtn.get = function() {
    if ( user._tasks === undefined ) {
      throw "User's RTM Tasks need to be updated first"
    }
    return user._tasks;
  };

  /**
   * Update the list of RTM Tasks for this User.
   *
   * This will also update the User's RTM Lists and add the list to
   * each Task item.
   * @param {function} callback Callback function(err, task)
   * @param {RTMError} callback.err RTM API Response, if encountered
   * @param {RTMTask[]} callback.task List of User's RTM Tasks
   * @function RTMUser~tasks/update
   */
  rtn.update = function(callback) {
    let count = 0;
    let calls = 2;
    let returned = false;

    // Update the User's Lists and Tasks
    _lists.get(user, function(err, lists) {
      user._lists = lists;
      _tasksUpdateCallback(err);
    });
    _tasks.get(user, function(err, tasks) {
      user._tasks = tasks;
      _tasksUpdateCallback(err);
    });

    // Callback for each of list and task updates
    function _tasksUpdateCallback(err) {
      count++;
      if ( !returned ) {
        if ( err ) {
          returned = true;
          return callback(err);
        }
        else if ( count === calls ) {
          returned = true;
          _parseTasks();
          return callback(null, user._tasks);
        }
      }
    }

    // Add the List to each Task
    function _parseTasks() {
      for ( let i = 0; i < user._tasks.length; i++ ) {
        for ( let j = 0; j < user._lists.length; j++ ) {
          if ( user._tasks[i].list_id === user._lists[j].id ) {
            user._tasks[i]._list = user._lists[j];
          }
        }
      }
    }
  };

  /**
   * Add a new RTM Task for this User
   * @param {string} name Task Name (can include 'Smart Add' syntax)
   * @param {object} [props] Task Properties
   * @param {string} props.due Task Due Date (RTM supported date format)
   * @param {int} props.priority Task Priority (1, 2, 3)
   * @param {string} props.list Task List Name
   * @param {string[]} props.tags Task Tags
   * @param {string} props.location Task Location Name
   * @param {string} props.start Task Start Date (RTM supported date format)
   * @param {string} props.repeat Task Repeat Format (RTM supported repeat format)
   * @param {string} props.estimate Task Time Estimate (RTM supported time estimate format)
   * @param {string} props.to Contact Name to give Task to (existing contact or email address)
   * @param {string} props.url Task Reference URL
   * @param {string} props.note Task Note
   * @param {function} callback Callback function(err, task)
   * @param {RTMError} callback.err RTM API Response, if encountered
   * @param {RTMTask[]} callback.task List of User's RTM Tasks
   * @function RTMUser~tasks/add
   */
  rtn.add = function(name, props, callback) {
    if ( callback === undefined && typeof props === 'function' ) {
      callback = props;
      props = {};
    }
    _tasks.add(name, props, user, function(err) {
      if ( err ) {
        return callback(err);
      }
      return rtn.update(callback);
    });
  };

  return rtn;
};