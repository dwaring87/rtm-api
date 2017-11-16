'use strict';

const taskIds = require('../utils/taskIds.js');


/**
 * ### RTM List
 *
 * This Class is used to represent the combined properties of an RTM TaskSeries
 * combined with an RTM Task.  If an RTM TaskSeries has more than one task
 * property then there will be multiple `RTMTask` instances representing the
 * data (which will duplicate the TaskSeries properties).
 *
 * Each instance of an `RTMTask` contains a `list_id`, `taskseries_id` and
 * `task_id` property.
 *
 * All of the taskseries and task properties from the RTM API are directly
 * accessible as `RTMTask` properties.
 *
 * ```
 * let task = new RTMTask(..., ..., ...);
 * let name = task.name;
 * let priority = task.priority;
 * ```
 * @class
 */
class RTMTask {

  /**
   * Create a new RTM Task
   * @param {number} userId RTM User ID
   * @param {number} listId RTM List ID
   * @param {object} series Taskseries properties (resp.task.list[].taskseries[])
   * @param {object} task Task properties (resp.task.list[].taskseries[].task)
   */
  constructor(userId, listId, series, task) {

    // List added after construction
    this._list = undefined;

    /**
     * List ID
     * @type {Number}
     */
    this.list_id = parseFloat(listId);

    /**
     * TaskSeries ID
     * @type {Number}
     */
    this.taskseries_id = parseFloat(series.id);

    /**
     * Task Creation Date
     * @type {Date|undefined}
     */
    this.created = series.created.toString() === '' ? undefined : new Date(series.created);

    /**
     * Task Modification Date
     * @type {Date|undefined}
     */
    this.modified = series.modified.toString() === '' ? undefined : new Date(series.modified);

    /**
     * Task Name
     * @type {string}
     */
    this.name = series.name;

    /**
     * Task Creation Source
     * @type {string}
     */
    this.source = series.source;

    /**
     * Task Reference URL
     * @type {string|undefined}
     */
    this.url = series.url === '' ? undefined : series.url;

    /**
     * Task Location ID
     * @type {number|undefined}
     */
    this.location_id = series.location_id.toString() === '' ? undefined : parseFloat(series.location_id);

    /**
     * Task Tags
     * @type {string[]}
     */
    this.tags = series.tags.tag !== undefined ? series.tags.tag : [];
    if ( !Array.isArray(this.tags) ) {
      this.tags = [this.tags];
    }

    /**
     * Task Participants
     * @type {Array}
     */
    this.participants = series.participants;


    /**
     * Task Note
     * @typedef {Object} RTMTask~Note
     * @property {number} id Note ID
     * @property {Date} created Note Creation Date
     * @property {Date} modified Note Modified Date
     * @property {string} title Note Title
     * @property {string} body Note Body
     */

    /**
     * Task Notes
     * @type {RTMTask~Note[]}
     */
    this.notes = series.notes.note !== undefined ? series.notes.note : [];
    if ( !Array.isArray(this.notes) ) {
      this.notes = [this.notes];
    }
    for ( let i = 0; i < this.notes.length; i++ ) {
      this.notes[i].id = parseFloat(this.notes[i].id);
      this.notes[i].created = new Date(this.notes[i].created);
      this.notes[i].modified = new Date(this.notes[i].modified);
      this.notes[i].title = this.notes[i].title === '' ? undefined : this.notes[i].title;
      this.notes[i].body = this.notes[i]['$t'];
      delete this.notes[i]['$t'];
    }

    /**
     * Task ID
     * @type {Number}
     */
    this.task_id = parseFloat(task.id);

    /**
     * Task Due Date
     * @type {Date|undefined}
     */
    this.due = task.due.toString() === '' ? undefined : new Date(task.due);

    /**
     * Task Due Time Flag (true when `due` includes a Due Time)
     * @type {boolean}
     */
    this.has_due_time = task.has_due_time.toString() === '1';

    /**
     * Task Added Date
     * @type {Date|undefined}
     */
    this.added = task.added.toString() === '' ? undefined : new Date(task.added);

    /**
     * Task Completed Date
     * @type {Date|undefined}
     */
    this.completed = task.completed.toString() === '' ? undefined : new Date(task.completed);

    /**
     * Task Completed Flag (true when task is marked as completed)
     * @type {boolean}
     */
    this.isCompleted = this.completed !== undefined;

    /**
     * Task Deleted Flag
     * @type {Date|undefined}
     */
    this.deleted = task.deleted.toString() === '' ? undefined : new Date(task.deleted);

    /**
     * Task Priority (0, 1, 2, or 3)
     * @type {int}
     */
    this.priority = task.priority.toString() === 'N' ? 0 : parseInt(task.priority);

    /**
     * Task Postponed Flag
     * @type {boolean}
     */
    this.postponed = task.postponed.toString() === '1';

    /**
     * Task Time Estimate
     * @type {string|undefined}
     */
    this.estimate = task.estimate.toString() === '' ? undefined : task.estimate;


    // Assign Task Index
    this._index = taskIds.getIndex(userId, this);

  }


  /**
   * An index added to each RTMTask based on the `task_id`
   * @type {int}
   */
  get index() {
    return this._index;
  }

  /**
   * The `RTMList` this Task is in
   * @type {RTMList}
   */
  get list() {
    if ( this._list === undefined ) {
      throw "Tasks not loaded with associated Lists"
    }
    return this._list;
  }

  /**
   * All of the RTM TaskSeries properties
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

module.exports = RTMTask;