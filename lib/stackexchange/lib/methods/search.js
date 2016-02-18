'use strict';

/**
 * Required modules.
 */
var query = require('../query');

/**
 * Searches a site for any questions which fit the given criteria.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @api public
 */
function search (criteria, callback) {
  query('search', criteria, callback);
}

/**
 * Extension of search, allows more criteria.
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @api public
 */
function advanced (criteria, callback) {
  query('search/advanced', criteria, callback);
}

// Expose commands.
module.exports.search = search;
module.exports.advanced = advanced;
