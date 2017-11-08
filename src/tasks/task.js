'use strict';


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
   * @param {number} list_id RTM List ID
   * @param {object} series taskseries properties (resp.tasks.list[].taskseries[])
   * @param {object} task task properties (resp.tasks.list[].taskseries[].task)
   */
  constructor(list_id, series, task) {
    this._index = undefined;
    this.list_id = parseFloat(list_id);
    this._parseSeriesProps(series);
    this._parseTaskProps(task);
  }

  /**
   * Parse the task series properties and add them as class properties
   * @param props
   * @private
   */
  _parseSeriesProps(props) {
    for ( let key in props ) {
      if ( props.hasOwnProperty(key) ) {
        let value = props[key];

        // Change key names
        if ( key === 'id' ) {
          key = 'taskseries_id';
        }

        // Parse key values
        if ( key === 'taskseries_id' || key === 'location_id' ) {
          if ( value !== '' ) {
            value = parseFloat(value);
          }
          else {
            value = undefined;
          }
        }
        else if ( key === 'created' || key === 'modified' ) {
          if ( value !== '' ) {
            value = new Date(value);
          }
          else {
            value = undefined;
          }
        }
        else if ( key === 'tags' ) {
          if ( value.tag ) {
            value = value.tag;
            if ( !Array.isArray(value) ) {
              value = [value];
            }
          }
          else {
            value = [];
          }
        }
        else if ( key === 'notes' ) {
          if ( value.note ) {
            value = value.note;
            if ( !Array.isArray(value) ) {
              value = [value];
            }
            for ( let i = 0; i < value.length; i++ ) {
              Object.defineProperty(value[i], 'body', Object.getOwnPropertyDescriptor(value[i], '$t'));
              delete value[i]['$t'];
            }
          }
        }

        // Set Class properties
        if ( key !== 'task' ) {
          this[key] = value;
        }
      }
    }
  }

  /**
   * Parse the task properties and add them as class properties
   * @param props
   * @private
   */
  _parseTaskProps(props) {
    for ( let key in props ) {
      if ( props.hasOwnProperty(key) ) {
        let value = props[key];

        // Change key names
        if ( key === 'id' ) {
          key = 'task_id';
        }

        // Parse key values
        if ( key === 'task_id' ) {
          value = parseFloat(value);
        }
        else if ( key === 'due' || key === 'added' || key === 'completed' || key === 'deleted') {
          if ( value !== '' ) {
            value = new Date(value);
          }
          else {
            value = undefined;
          }
        }
        else if ( key === 'has_due_time' || key === 'postponed' ) {
          value = value === '1';
        }
        else if ( key === 'priority' ) {
          if ( value === 'N' ) {
            value = 0;
          }
          else {
            value = parseInt(value);
          }
        }

        // Set Class properties
        this[key] = value;
      }
    }
  }


  /**
   * An index added to each RTM TaskSeries based on its `id`
   * @returns {int}
   */
  get index() {
    return this._index;
  }

  /**
   * All of the RTM TaskSeries properties
   * @returns {object}
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