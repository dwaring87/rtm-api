'use strict';

const RTMList = require('./index.js');


/**
 * API Call: rtm.lists.getList
 * @param user RTMUser
 * @param callback Callback function(err, lists)
 * @private
 */
function get(user, callback) {
  user.get('rtm.lists.getList', function(err, resp) {
    if ( err ) {
      return callback(err);
    }

    // List of lists to return
    let rtn = [];

    // Parse each of the lists
    let lists = resp.lists.list;
    for ( let i = 0; i < lists.length; i++ ) {
      rtn.push(
        new RTMList(lists[i])
      );
    }

    // Call the callback
    return callback(null, rtn);
  });
}


/**
 * API Call: rtm.lists.add
 * @param name RTM List Name
 * @param [filter] RTM Smart List Filter
 * @param user RTMUser
 * @param callback Callback function(err)
 * @private
 */
function add(name, filter, user, callback) {

  // Parse Parameters
  if ( callback === undefined && typeof user === 'function' ) {
    callback = user;
    user = filter;
    filter = undefined;
  }

  // Invalid List Names
  if ( name === 'Inbox' || name === 'Sent' ) {
    throw "Invalid List Name"
  }

  // Set Parameters
  let params = {
    name: name,
    timeline: user.timeline
  };
  if ( filter !== undefined ) {
    params.filter = filter;
  }

  // Add List
  user.get('rtm.lists.add', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.lists.delete
 * @param id RTM List ID
 * @param user RTMUser
 * @param callback Callback function(err)
 * @private
 */
function remove(id, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: id
  };
  user.get('rtm.lists.delete', params,  function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.lists.setName
 * @param id RTM List ID
 * @param name New RTM List Name
 * @param user RTMUser
 * @param callback Callback function(err)
 * @private
 */
function rename(id, name, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: id,
    name: name
  };
  user.get('rtm.lists.setName', params, function(err) {
    return callback(err);
  });
}




module.exports = {
  get: get,
  add: add,
  remove: remove,
  rename: rename
};