'use strict';

const RTMTask = require('./index.js');
const taskIds = require('../utils/taskIds.js');

/**
 * API Call: rtm.tasks.getList
 * @param user RTMUser
 * @param [filter] Task Filter
 * @param callback Callback function(err, tasks)
 * @private
 */
function get(user, filter, callback) {
  let params = {};
  if ( callback === undefined && typeof filter === 'function' ) {
    callback = filter;
  }
  else if ( filter !== '' ) {
    params.filter = filter;
  }

  user.get('rtm.tasks.getList', params, function(err, resp) {
    if ( err ) {
      return callback(err);
    }

    // List of task to return
    let rtn = [];

    // Parse each List
    let lists = resp.tasks.list;
    if ( lists !== undefined ) {
      for ( let i = 0; i < lists.length; i++ ) {
        let list = lists[i];

        // Parse the List's TaskSeries
        if ( list.taskseries ) {
          if ( !Array.isArray(list.taskseries) ) {
            list.taskseries = [list.taskseries];
          }
          for ( let j = 0; j < list.taskseries.length; j++ ) {
            let series = list.taskseries[j];
            if ( series.name === "Add Support for Sub Tasks" ) {
              console.log(series);
            }

            // Parse the TaskSeries' Tasks
            if ( !Array.isArray(series.task) ) {
              series.task = [series.task];
            }
            for ( let k = 0; k < series.task.length; k++ ) {
              let task = series.task[k];
              rtn.push(new RTMTask(user.id, list.id, series, task));
            }
          }
        }
      }
    }

    // Save the task indices
    taskIds.save();

    // Return with the callback
    return callback(null, rtn);

  });
}

/**
 * API Call rtm.tasks.add
 * Note: this uses RTM's 'smart add'
 * @param {string} name Task Name (or smart add syntax)
 * @param {{due: *, priority: *, list: *, tags: *, location: *, start: *, repeat: *, estimate: *, to: *, url: *, note: *}} props Additional task properties
 * @param user RTM User
 * @param callback Callback function(err)
 * @private
 */
function add(name, props, user, callback) {

  // Parse the props keys
  if ( props.due ) {
    name = name + " ^" + props.due;
  }
  if ( props.priority ) {
    name = name + " !" + props.priority
  }
  if ( props.list ) {
    name = name + " #" + props.list;
  }
  if ( props.tags ) {
    if ( !Array.isArray(props.tags) ) {
      props.tags = [props.tags];
    }
    for ( let i = 0; i < props.tags.length; i++ ) {
      name = name + " #" + props.tags[i];
    }
  }
  if ( props.location ) {
    name = name + " @" + props.location;
  }
  if ( props.start ) {
    name = name + " ~" + props.start;
  }
  if ( props.repeat ) {
    name = name + " *" + props.repeat;
  }
  if ( props.estimate ) {
    name = name + " =" + props.estimate;
  }
  if ( props.to ) {
    name = name + " +" + props.to;
  }
  if ( props.url ) {
    name = name + " " + props.url;
  }
  if ( props.note ) {
    name = name + " //" + props.note;
  }

  // Set the request params
  let params = {
    timeline: user.timeline,
    name: name,
    parse: '1'
  };

  // Make the API Request
  user.get('rtm.tasks.add', params, function(err) {
    return callback(err);
  });

}

/**
 * API Call: rtm.tasks.complete
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function complete(listId, taskSeriesId, taskId, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId
  };
  user.get('rtm.tasks.complete', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.uncomplete
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function uncomplete(listId, taskSeriesId, taskId, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId
  };
  user.get('rtm.tasks.uncomplete', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.setPriority
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {int} priority Task Priority
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function priority(listId, taskSeriesId, taskId, priority, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
    priority: priority
  };
  user.get('rtm.tasks.setPriority', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.addTags
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {string[]} tags Tags to Add
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function addTags(listId, taskSeriesId, taskId, tags, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
    tags: tags.join(',')
  };
  user.get('rtm.tasks.addTags', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.notes.add
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {string} title Title of Note
 * @param {string|string[]} notes Note(s) to add to the Task
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function addNotes(listId, taskSeriesId, taskId, title, notes, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
	note_title: title,
    note_text: notes
  };
  user.get('rtm.tasks.notes.add', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.delete
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function remove(listId, taskSeriesId, taskId, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
  };
  user.get('rtm.tasks.delete', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.movePriority
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {string} direction Direction to move 'up' or 'down'
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function movePriority(listId, taskSeriesId, taskId, direction, user, callback) {
  if ( direction.toLowerCase() !== 'up' && direction.toLowerCase() !== 'down' ) {
    throw "Incorrect priority direction.  Must be either 'up' or 'down'";
  }
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
    direction: direction.toLowerCase()
  };
  user.get('rtm.tasks.movePriority', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.moveTo
 * @param {number} listId RTM List ID (original)
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {number} toListId RTM List ID (new)
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function move(listId, taskSeriesId, taskId, toListId, user, callback) {
  let params = {
    timeline: user.timeline,
    from_list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
    to_list_id: toListId
  };
  user.get('rtm.tasks.moveTo', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.postpone
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function postpone(listId, taskSeriesId, taskId, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId
  };
  user.get('rtm.tasks.postpone', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.removeTags
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {string[]} tags Tags to Remove
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function removeTags(listId, taskSeriesId, taskId, tags, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
    tags: tags.join(',')
  };
  user.get('rtm.tasks.removeTags', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.setDueDate
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {string} due Task Due Date (will be parsed by RTM)
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function setDueDate(listId, taskSeriesId, taskId, due, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
    due: due,
    parse: 1
  };
  user.get('rtm.tasks.setDueDate', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.setStartDate
 * @param {number}   listId       RTM List ID
 * @param {number}   taskSeriesId RTM Task Series ID
 * @param {number}   taskId       RTM Task ID
 * @param {string}   start        Task Start Date/Time (will be parsed by RTM)
 * @param {RTMUser}  user         RTM User
 * @param {Function} callback     Callback function(err)
 */
function setStartDate(listId, taskSeriesId, taskId, start, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
    start: start,
    parse: 1
  };
  user.get('rtm.tasks.setStartDate', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.setName
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {string} name New Task Name
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function setName(listId, taskSeriesId, taskId, name, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
    name: name
  };
  user.get('rtm.tasks.setName', params, function(err) {
    return callback(err);
  });
}

/**
 * API Call: rtm.tasks.setURL
 * @param {number} listId RTM List ID
 * @param {number} taskSeriesId RTM Task Series ID
 * @param {number} taskId RTM Task ID
 * @param {string} url New Task URL
 * @param {RTMUser} user RTM User
 * @param {function} callback function(err)
 * @private
 */
function setURL(listId, taskSeriesId, taskId, url, user, callback) {
  let params = {
    timeline: user.timeline,
    list_id: listId,
    taskseries_id: taskSeriesId,
    task_id: taskId,
    url: url
  };
  user.get('rtm.tasks.setURL', params, function(err) {
    return callback(err);
  });
}


module.exports = {
  get: get,
  add: add,
  complete: complete,
  uncomplete: uncomplete,
  priority: priority,
  addNotes: addNotes,
  addTags: addTags,
  remove: remove,
  movePriority: movePriority,
  move: move,
  postpone: postpone,
  removeTags: removeTags,
  setDueDate: setDueDate,
  setStartDate: setStartDate,
  setName: setName,
  setURL: setURL
};
