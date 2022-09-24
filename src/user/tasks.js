'use strict';

const _tasks = require('../task/helper.js');
const _lists = require('../list/helper.js');
const taskIds = require('../utils/taskIds.js');
const errors = require('../response/error.js');

/**
 * This module returns the RTM Tasks-related functions for the RTMUser
 * @param {RTMUser} user The RTM User instance
 * @returns {{get: function, add:function, remove: function, complete: function, uncomplete: function, addTags: function, removeTags: function, priority: function, decreasePriority: function, increasePriority: function, move: function, setDueDate: function, postpone: function, setName: function}}
 * @private
 */
module.exports = function(user) {
  let rtn = {};

  /**
   * Get the list of RTM Tasks for this User.
   * @param {string} [filter] Tasks Filter (RTM Advanced Search Syntax)
   * @param {function} callback Callback function(err, tasks)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @param {RTMTask[]} callback.tasks List of User's RTM Tasks
   * @function RTMUser~tasks/get
   */
  rtn.get = function(filter, callback) {
    if ( callback === undefined && typeof filter === 'function' ) {
      callback = filter;
      filter = "";
    }

    // Callback counters
    let count = 0;
    let calls = 2;
    let returned = false;

    // Lists and Tasks
    let LISTS = {};
    let TASKS = [];

    // Update the User's Lists and Tasks
    _lists.get(user, function(err, lists) {
      if ( lists ) {
        for ( let i = 0; i < lists.length; i++ ) {
          LISTS[lists[i].id] = lists[i];
        }
      }
      _tasksUpdateCallback(err);
    });
    _tasks.get(user, filter, function(err, tasks) {
      TASKS = tasks;
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
          return callback(null, TASKS);
        }
      }
    }

    // Add the List to each Task
    function _parseTasks() {
      for ( let i = 0; i < TASKS.length; i++ ) {
        let list = LISTS[TASKS[i].list_id];
        if ( list === undefined ) {
          list = {
            id: TASKS[i].list_id,
            name: "List #" + TASKS[i].list_id
          }
        }
        TASKS[i]._list = list;
      }
    }
  };

  /**
   * Get the RTMTask specified by its index
   * @param {int} index Task Index
   * @param {string} [filter] Tasks Filter (RTM Advanced Search Syntax)
   * @param {function} callback Callback function(err, task)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @param {RTMTask} callback.task Matching RTM Task
   * @function RTMUser~tasks/getTask
   */
  rtn.getTask = function(index, filter, callback) {
    if ( callback === undefined && typeof filter === 'function' ) {
      callback = filter;
      filter = "";
    }

    // Get Task Info
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Get Task From API
      user.tasks.get(filter, function(err, tasks) {
        if ( err ) {
          return callback(err);
        }

        // Find Matching Task
        let found = false;
        for ( let i = 0; i < tasks.length; i++ ) {
          if ( !found && tasks[i].task_id === taskId ) {
            found = true;
            return callback(null, tasks[i]);
          }
        }

        // Task Not Found
        if ( !found ) {
          return callback(errors.referenceError());
        }

      });

    });

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
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/add
   */
  rtn.add = function(name, props, callback) {
    if ( callback === undefined && typeof props === 'function' ) {
      callback = props;
      props = {};
    }
    return _tasks.add(name, props, user, callback);
  };

  /**
   * Mark the specified Task as complete
   * @param {int} index Task Index
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/complete
   */
  rtn.complete = function(index, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Complete the Task
      return _tasks.complete(
        listId,
        taskSeriesId,
        taskId,
        user,
        callback
      );

    });

  };

  /**
   * Mark the specified Task as NOT complete
   * @param {int} index Task Index
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/uncomplete
   */
  rtn.uncomplete = function(index, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Complete the Task
      return _tasks.uncomplete(
        listId,
        taskSeriesId,
        taskId,
        user,
        callback
      );

    });

  };

  /**
   * Set the priority of the specified Task
   * @param {int} index Task Index
   * @param {int} priority Task Priority
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/priority
   */
  rtn.priority = function(index, priority, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Set the Priority
      return _tasks.priority(
        listId,
        taskSeriesId,
        taskId,
        priority,
        user,
        callback
      );

    });

  };

  /**
   * Add the specified tag(s) to the Task
   * @param {int} index Task Index
   * @param {string|string[]} tags Tag(s) to add to task
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/addTags
   */
  rtn.addTags = function(index, tags, callback) {

    // Make sure tags is an array
    if ( !Array.isArray(tags) ) {
      tags = [tags];
    }

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Add the Tags
      return _tasks.addTags(
        listId,
        taskSeriesId,
        taskId,
        tags,
        user,
        callback
      );

    });

  };


  /**
   * Add the specified note to the Task
   * @param {int} index Task Index
   * @param {string} title Title of the Note
   * @param {string|string[]} notes Note(s) to add to task
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/addNotes
   */
  rtn.addNotes = function(index, title, notes, callback) {
    var title = (typeof title !== 'undefined') ? title : "";

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Add the Note
      return _tasks.addNotes(
        listId,
        taskSeriesId,
        taskId,
    	title,
        notes,
        user,
        callback
      );

    });

  };

  /**
   * Remove the specified Task from the User's Account
   * @param {int} index Task Index
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/remove
   */
  rtn.remove = function(index, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Remove the Task
      return _tasks.remove(
        listId,
        taskSeriesId,
        taskId,
        user,
        callback
      );

    });

  };

  /**
   * Increase the Priority of the specified Task
   * @param {int} index Task Index
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/increasePriority
   */
  rtn.increasePriority = function(index, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Increase the Priority of the Task
      return _tasks.movePriority(
        listId,
        taskSeriesId,
        taskId,
        'up',
        user,
        callback
      );

    });

  };

  /**
   * Decrease the Priority of the specified Task
   * @param {int} index Task Index
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/decreasePriority
   */
  rtn.decreasePriority = function(index, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Decrease the Priority of the Task
      return _tasks.movePriority(
        listId,
        taskSeriesId,
        taskId,
        'down',
        user,
        callback
      );

    });

  };

  /**
   * Move the specified Task to a different List
   * @param {int} index Task Index
   * @param {string} listName List Name to move Task to
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/move
   */
  rtn.move = function(index, listName, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Get the List
      user.lists.get(function(err, lists) {
        if ( err ) {
          return callback(err);
        }

        // Find the List
        let id = [];
        for ( let i = 0; i < lists.length; i++ ) {
          if ( lists[i].name.toLowerCase() === listName.toLowerCase() ) {
            id.push(lists[i].id);
          }
        }

        // No List Match
        if ( id.length !== 1 ) {
          return callback(errors.referenceError());
        }

        // Move the Task
        else {
          return _tasks.move(
            listId,
            taskSeriesId,
            taskId,
            id[0],
            user,
            callback
          );
        }

      });

    });

  };

  /**
   * Postpone the due date of the Task by 1 day
   * @param {int} index Task Index
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/postpone
   */
  rtn.postpone = function(index, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Postpone the Task
      return _tasks.postpone(
        listId,
        taskSeriesId,
        taskId,
        user,
        callback
      );

    });

  };

  /**
   * Remove the specified tag(s) from the Task
   * @param {int} index Task Index
   * @param {string|string[]} tags Tags to remove from the Task
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/removeTags
   */
  rtn.removeTags = function(index, tags, callback) {

    // Make sure tags is an array
    if ( !Array.isArray(tags) ) {
      tags = [tags];
    }

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Remove the Tags
      return _tasks.removeTags(
        listId,
        taskSeriesId,
        taskId,
        tags,
        user,
        callback
      );

    });

  };

  /**
   * Set the Due Date of the specified Task
   * @param {int} index Task Index
   * @param {string} due The Due Date of the Task (RTM parsed date)
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/setDueDate
   */
  rtn.setDueDate = function(index, due, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Decrease the Priority of the Task
      return _tasks.setDueDate(
        listId,
        taskSeriesId,
        taskId,
        due,
        user,
        callback
      );

    });

  };

  /**
   * Set the Name of the specified Task
   * @param {int} index Task Index
   * @param {string} name New Task Name
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/setName
   */
  rtn.setName = function(index, name, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Decrease the Priority of the Task
      return _tasks.setName(
        listId,
        taskSeriesId,
        taskId,
        name,
        user,
        callback
      );

    });

  };

  /**
   * Set the URL of the specified Task
   * @param {int} index Task Index
   * @param {string} url New Task URL
   * @param {function} callback Callback function(err)
   * @param {RTMError} callback.err RTM API Error Response, if encountered
   * @function RTMUser~tasks/setURL
   */
  rtn.setURL = function(index, url, callback) {

    // Get the Task
    _getTaskInfo(index, function(err, listId, taskSeriesId, taskId) {
      if ( err ) {
        return callback(err);
      }

      // Decrease the Priority of the Task
      return _tasks.setURL(
        listId,
        taskSeriesId,
        taskId,
        url,
        user,
        callback
      );

    });

  };



  /**
   * Get the Matching Task IDs by Index
   * @param {int} index Task Index
   * @param callback Callback function(err, list_id, taskseries_id, task_id)
   * @private
   */
  function _getTaskInfo(index, callback) {

    // Get IDs
    let listId = taskIds.getListId(user.id, index);
    let taskSeriesId = taskIds.getTaskSeriesId(user.id, index);
    let taskId = taskIds.getTaskId(user.id, index);

    // All IDs found...
    if ( listId !== undefined && taskSeriesId !== undefined && taskId !== undefined ) {
      return callback(null, listId, taskSeriesId, taskId);
    }

    // Get Task From API
    user.tasks.get(function(err, tasks) {
      if ( err ) {
        return callback(err);
      }

      // Find Matching Task
      let found = false;
      for ( let i = 0; i < tasks.length; i++ ) {
        if ( !found && tasks[i].task_id === taskId ) {
          found = true;
          return callback(null, tasks[i].list_id, tasks[i].taskseries_id, tasks[i].task_id);
        }
      }

      // Task Not Found
      if ( !found ) {
        return callback(errors.referenceError());
      }
    });
  }

  return rtn;
};
