const request = require('request');
const url = require('url');
const config = require('./config');
const parser = require('./parser');

/**
 * Execute a query after checkign if criteria are available.
 *
 * @param {String} destination query method
 * @param {Object} criteria parameters to query against
 * @api private
 */
module.exports = function query(destination, criteria) {
  // Query against the predefined website and construct the endpoint.
  // criteria.site = config.get('site');
  const endpoint = url.format({
    protocol: config.get('protocol'),
    host: config.get('api'),
    pathname: `/${config.get('version')}/${destination}`,
    query: criteria,
  });
  return new Promise((resolve, reject) => request({
    url: endpoint,
    encoding: null,
  }, (error, res) => {
    if (error) {
      reject(error);
    } else {
      parser.parseBody(res.body, (err, body) => (err
        ? reject(err)
        : resolve(body)));
    }
  }));
};
