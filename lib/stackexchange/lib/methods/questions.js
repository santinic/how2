'use strict';

/**
 * Required modules.
 */
var query = require('../query')
  , post = require('../post')
  , Logger = require('devnull')
  , log = new Logger({ timestamp: false });


/**
 * Gets all the questions on the site or returns the questions identified in [ids].
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} ids collection of IDs
 * @api public
 */
function questions (criteria, callback, ids) {
  ids = ids || [];
  query('questions/' + ids.join(';'), criteria, callback);
}

/**
 * Gets the answers to a set of questions identified in [ids].
 *
 * @param {Object} criteria
 * @param {Function} callback return results
 * @param {Array} ids collection of IDs
 * @api public
 */
function answers (criteria, callback, ids) {
  if (!ids || !ids.length) return log.error('questions.answers lacks IDs to query');
  query('questions/' + ids.join(';') + '/answers', criteria, callback);
}

/**
 * upvote - Casts an upvote on the selected question
 *
 * @param  {Object} criteria contains server key and valid access_token
 * @param  {Integer} id       ID of a question
 * @param  {Function} callback return results
 * @param  {Boolean} undo     Undo the upvote cast
 * @api public
 */
function upvote(criteria, id, callback, undo) {
  // Key and Access Token are needed in criteria
  if(!criteria['key'] || !criteria['access_token']) {
    return log.error('questions.upvote lacks key and/or access token as criteria');
  }
  undo = undo? "/undo" : "";
  post('questions/' + id.toString() + '/upvote' + undo, criteria, callback);
}

/**
 * downvote - Casts a downvote on the selected question
 *
 * @param  {Object} criteria contains server key and valid access_token
 * @param  {Integer} id       ID of a question
 * @param  {Function} callback return results
 * @param  {Boolean} undo     Undo the downvote cast
 * @api public
 */
function downvote(criteria, id, callback, undo) {
  // Key and Access Token are needed in criteria
  if(!criteria['key'] || !criteria['access_token']) {
    return log.error('questions.upvote lacks key and/or access token as criteria');
  }
  undo = undo? "/undo" : "";
  post('questions/' + id.toString() + '/downvote' + undo, criteria, callback);
}

// Expose commands.
module.exports.questions = questions;
module.exports.answers = answers;
module.exports.upvote = upvote;
module.exports.downvote = downvote;
