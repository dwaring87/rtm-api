'use strict';

const config = require('../../config');
const fs = require('fs');

const FILE = config.task_id_cache_file;

// Cache of User's Task Indices --> Task IDs
let CACHE = {
  USERS: {}
};



// Read the Cache
_readCache();



/**
 * Get a Task Index for the specified User's Task ID.
 *
 * This will return a previously assigned Task Index for a given Task ID
 * or return an unassigned number for an unassigned task
 * @param {number} userId RTM User ID
 * @param {RTMTask} task RTM Task
 * @returns {int} Task Index
 * @private
 */
function getIndex(userId, task) {
  userId = parseFloat(userId);
  let taskId = parseFloat(task.task_id);
  let taskSeriesId = parseFloat(task.taskseries_id);
  let listId = parseFloat(task.list_id);

  // Get User Cache
  let user = getUser(userId);
  let indices = Object.keys(user);
  let ids = Object.values(user);

  // Find matching cached index
  for ( let i = 0; i < ids.length; i++ ) {
    if ( ids[i]['task_id'] === taskId ) {
      if ( ids[i]['taskseries_id'] === taskSeriesId ) {
        if ( ids[i]['list_id'] === listId ) {
          return parseInt(indices[i]);
        }
      }
    }
  }

  // Create a new Index
  let index = 1;
  while ( indices.indexOf(index.toString()) > -1 ) {
    index++;
  }
  if ( CACHE.USERS[userId] === undefined ) {
    CACHE.USERS[userId] = {};
  }
  CACHE.USERS[userId][index] = {
    task_id: taskId,
    taskseries_id: taskSeriesId,
    list_id: listId
  };
  return parseInt(index);

}


/**
 * Get a Task ID by Task Index Number.
 *
 * This will return the cached task id number for the specified user
 * for the given task index number or undefined if not found in the cache.
 * @param {number} userId RTM User ID
 * @param {int} taskIndex Task Index
 * @returns {number|undefined} RTM Task ID
 * @private
 */
function getTaskId(userId, taskIndex) {
  userId = parseFloat(userId);
  taskIndex = parseInt(taskIndex);

  let user = getUser(userId);
  let task = user[taskIndex.toString()];

  return task === undefined ? undefined : task['task_id'];
}

/**
 * Get a TaskSeries ID by Task Index Number.
 *
 * This will return the cached task series id number for the specified user
 * for the given task index number or undefined if not found in the cache.
 * @param {number} userId RTM User ID
 * @param {int} taskIndex Task Index
 * @returns {number|undefined} RTM Task Series ID
 * @private
 */
function getTaskSeriesId(userId, taskIndex) {
  userId = parseFloat(userId);
  taskIndex = parseInt(taskIndex);

  let user = getUser(userId);
  let task = user[taskIndex.toString()];

  return task === undefined ? undefined : task['taskseries_id'];
}

/**
 * Get a List ID by Task Index Number.
 *
 * This will return the cached list id number for the specified user
 * for the given task index number or undefined if not found in the cache.
 * @param {number} userId RTM User ID
 * @param {int} taskIndex Task Index
 * @returns {number|undefined} RTM List ID
 * @private
 */
function getListId(userId, taskIndex) {
  userId = parseFloat(userId);
  taskIndex = parseInt(taskIndex);

  let user = getUser(userId);
  let task = user[taskIndex.toString()];

  return task === undefined ? undefined : task['list_id'];
}


/**
 * Get the User's Entire Cache.
 *
 * This will return an Object of the entire User's task index / id cache.  The
 * Object's name is the index number and the value is the task id.
 * @param userId
 * @returns {{}}
 * @private
 */
function getUser(userId) {
  userId = parseFloat(userId);
  return CACHE.USERS[userId] === undefined ? {} : CACHE.USERS[userId];
}


/**
 * Save the current Task Index Cache to Disk
 * @private
 */
function save() {
  fs.writeFileSync(FILE, JSON.stringify(CACHE));
}


/**
 * Clear the current Task Index Cache for the specified User
 * @param {number} userId RTM User ID
 * @private
 */
function clear(userId) {
  userId = parseFloat(userId);
  _readCache();
  CACHE.USERS[userId] = {};
  save();
}


/**
 * Load the saved cache
 * @private
 */
function _readCache() {
  if ( fs.existsSync(FILE) ) {
    CACHE = require(FILE);
  }
}



module.exports = {
  getIndex: getIndex,
  getTaskId: getTaskId,
  getTaskSeriesId: getTaskSeriesId,
  getListId: getListId,
  getUser: getUser,
  save: save,
  clear: clear
};