var zlib = require('zlib');

/**
 * Parse the buffer, StackExchange promises to always deliver zipped content,
 * but since JSON parsing is required just wrap it in a try/catch.
 *
 * @param {Buffer} buffer response content
 * @param {Function} callback return results
 * @api private
 */
function parseBody (buffer, callback) {
  zlib.unzip(buffer, function Unzipped (error, body) {
    try {
      callback(error, JSON.parse(body.toString()));
    } catch (error) {
      callback(error);
    }
  });
}

// Export functions
module.exports.parseBody = parseBody;
