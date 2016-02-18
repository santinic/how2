'use strict';

var config = require('./config')
  , parser = require('./parser')
  , request = require('request')
  , url = require('url')
  , Logger = require('devnull')
  , log = new Logger({ timestamp: false });


/**
 * Post a query with supplied data.
 *
 * @param {String} destination query method
 * @param {Object} data parameters to send as a POST form
 * @param {Function} callback return results
 * @api private
 */
module.exports = function post (destination, data, callback) {
  if (!callback) return log.critical('No callback supplied for: ' +  destination);

  // Query against the predefined website and construct the endpoint.
  data.site = config.get('site');
  var endpoint = url.format({
      protocol: config.get('protocol')
    , host: config.get('api')
    , pathname: '/' + config.get('version') + '/' + destination
  });

  // Make a post request on proper response call callback.
  request(
      { url: endpoint, encoding: null, method: "POST", form: data }
    , function response (error, res) {
		if (error) {
			callback(error);
		}
        else {
			parser.parseBody.call(this, res.body, callback);
		}
      }
  );
};
