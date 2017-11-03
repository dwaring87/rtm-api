'use strict';

/**
 * ### RTMClient
 * @see RTMClient
 * @module client
 */

/**
 * ### RTM Client
 *
 * This Class is used to represent an API Client.  The Client contains
 * the API Key, API Secret and access permissions used to access the
 * RTM API.
 *
 * **Module:** client
 * @class
 * @alias RTMClient
 */
class RTMClient {

  /**
   * Create a new RTM Client with the specified API access information
   * @param {string} apiKey RTM API Key
   * @param {string} apiSecret RTM API Secret
   * @param {string} [perms=RTMClient.PERM_READ] RTM API Access Permissions. This
   * should be one of {@link RTMClient.PERM_READ}, {@link RTMClient.PERM_WRITE} or
   * {@link RTMClient.PERM_DELETE}.
   * @constructor
   */
  constructor(apiKey, apiSecret, perms=RTMClient.PERM_READ) {
    this._apiKey = apiKey;
    this._apiSecret = apiSecret;
    this._perms = perms;
  }

  /**
   * RTM API Key
   * @returns {string}
   */
  get key() {
    return this._apiKey;
  }

  /**
   * RTM API Secret
   * @returns {string}
   */
  get secret() {
    return this._apiSecret;
  }

  /**
   * RTM API Access Permissions
   * @returns {string}
   */
  get perms() {
    return this._perms;
  }

}


/**
 * RTM API Access: `read` -
 * gives the ability to read task, contact, group and list details and contents.
 * @type {string}
 * @default
 */
RTMClient.PERM_READ = 'read';

/**
 * RTM API Access: `write` -
 * gives the ability to add and modify task, contact, group and list details and
 * contents (also allows you to `read`).
 * @type {string}
 * @default
 */
RTMClient.PERM_WRITE = 'write';

/**
 * RTM API Access: `delete` -
 * gives the ability to delete tasks, contacts, groups and lists (also allows
 * you to `read` and `write`).
 * @type {string}
 * @default
 */
RTMClient.PERM_DELETE = 'delete';



module.exports = RTMClient;
