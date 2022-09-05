
const os = require('os');
const path = require('path');

module.exports = {
  "api": {
    "scheme": "https",
    "url": {
      "auth": "www.rememberthemilk.com/services/auth/",
      "base": "api.rememberthemilk.com/services/rest/"
    },
    "version": 2,
    "format": "json",
    "rate": {
      "bursts": 3,
      "burstTimeout": 333,
      "burstWait": 120000,
      "timeout": 1000
    }
  },
  "task_id_cache_file": process.env.RTM_INDEX_CACHE ? process.env.RTM_INDEX_CACHE : path.normalize(os.homedir() + '/' + '.rtm.indexcache.json')
}
