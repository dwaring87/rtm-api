'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');

const FILENAME = '.rtm.idstore.json';
const FILE = path.normalize(os.homedir + '/' + FILENAME);

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
 * or return an unassigned number for a new Task ID
 * @param {number} userId RTM User ID
 * @param {number} taskId RTM Task ID
 * @returns {int} Task Index
 * @private
 */
function getIndex(userId, taskId) {
  userId = parseFloat(userId);
  taskId = parseFloat(taskId);

  let user = getUser(userId);
  let indices = Object.keys(user);
  let taskIds = Object.values(user);

  if ( taskIds.indexOf(taskId) > -1 ) {
    return parseInt(indices[taskIds.indexOf(taskId)]);
  }
  else {
    let index = 1;
    while ( indices.indexOf(index.toString()) > -1 ) {
      index++;
    }
    CACHE.USERS[userId][index] = taskId;
    return parseInt(index);
  }

}


/**
 * Get a Task ID by Task Index Number.
 *
 * This will return the cached task index number for the specified user
 * for the given task index number or undefined if not found in the cache.
 * @param {number} userId RTM User ID
 * @param {int} taskIndex Task Index
 * @returns {number} RTM Task ID
 * @private
 */
function getId(userId, taskIndex) {
  userId = parseFloat(userId);
  taskIndex = parseInt(taskIndex);

  let user = getUser(userId);
  return user[taskIndex.toString()];
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
 * Save the Current Task Index Cache to Disk
 * @private
 */
function save() {
  fs.writeFileSync(FILE, JSON.stringify(CACHE));
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
  getId: getId,
  getUser: getUser,
  save: save
};