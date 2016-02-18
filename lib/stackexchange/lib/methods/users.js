'use strict';

/**
 * Required modules.
 */
var query = require('../query')
  , Logger = require('devnull')
  , log = new Logger({ timestamp: false });

/**
 * Gets the answers to a set of users identified in [ids].
 *
 * @param {Object} criteria
 * @param {Array} ids collection of IDs
 * @param {Function} callback return results
 * @api public
 */
function answers (criteria, ids, callback) {
  if (!ids || !ids.length) return log.error('users.answers lacks IDs to query');
  query('users/' + ids.join(';') + '/answers', criteria, callback);
}

// Expose commands.
module.exports.answers = answers;
