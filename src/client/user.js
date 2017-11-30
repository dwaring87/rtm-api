'use strict';

const RTMClient = require('./index.js');
const RTMUser = require('../user/index.js');


/**
 * This module returns the user-related functions for RTMClient
 * @param {RTMClient} client RTMClient instance
 * @returns {{create: function, export: function, exportToString: function, import: function, importFromString: function}}
 */
module.exports = function(client) {
  let rtn = {};

  /**
   * Create a new `RTMUser` manually.
   *
   * This will also set the User's RTM API Client to this `RTMClient`.
   * @param {number} id The RTM User's ID
   * @param {string} username The RTM User's username
   * @param {string} fullname The RTM User's full name
   * @param {string} authToken The RTM User's Auth Token
   * @returns {RTMUser}
   * @function RTMClient~user/create
   */
  rtn.create = function(id, username, fullname, authToken) {
    let user = new RTMUser(id, username, fullname, authToken);
    user.client = client;
    return user;
  };

  /**
   * Get the User's required information:
   * - id
   * - username
   * - fullname
   * - authToken
   * - client (if set or use this `RTMClient`)
   * @param {RTMUser} user The RTMUser to export
   * @returns {object}
   * @function RTMClient~user/export
   */
  rtn.export = function(user) {
    let rtn = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      authToken: user.authToken,
      timeline: user._timeline
    };
    if ( user.client ) {
      rtn.client = {
        apiKey: user.client.key,
        apiSecret: user.client.secret,
        perms: user.client.perms
      }
    }
    else {
      rtn.client = {
        apiKey: client.key,
        apiSecret: client.key,
        perms: client.perms
      }
    }

    return rtn;
  };

  /**
   * Get the User's required information as a JSON-string
   * @param {RTMUser} user The RTMUser to export
   * @returns {string}
   * @function RTMClient~user/exportToString
   */
  rtn.exportToString = function(user) {
    return JSON.stringify(rtn.export(user));
  };

  /**
   * Create a new `RTMUser` from an exported User's properties
   * @param {Object} properties The RTM User's required properties
   * @returns {RTMUser}
   * @function RTMClient~user/import
   */
  rtn.import = function(properties) {
    if ( properties.id && properties.username && properties.fullname && properties.authToken ) {
      let user = new RTMUser(properties.id, properties.username, properties.fullname, properties.authToken);
      if ( properties.timeline ) {
        user.timeline = properties.timeline;
      }
      if ( properties.client ) {
        user.client = new RTMClient(properties.client.apiKey, properties.client.apiSecret, properties.client.perms);
      }
      return user;
    }
    else {
      throw "Missing User Properties";
    }
  };

  /**
   * Create a new `RTMUser` from an exported User's properties' JSON-string
   * @param {string} string JSON-string of RTM User's required properties
   * @returns {RTMUser}
   * @function RTMClient~user/importFromString
   */
  rtn.importFromString = function(string) {
    return rtn.import(JSON.parse(string));
  };

  return rtn;
};