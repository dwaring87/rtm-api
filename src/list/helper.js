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
 * @param user RTMUser
 * @param callback Callback function(err)
 * @private
 */
function add(name, user, callback) {
  if ( name === 'Inbox' || name === 'Sent' ) {
    throw "Invalid List Name"
  }
  let params = {
    name: name,
    timeline: user.timeline
  };
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