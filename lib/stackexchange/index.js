'use strict';

var config = require('./config'),
    questions = require('./questions')

/**
 * Initialize StackExchange API.
 *
 * @Constructor
 * @param {Object} options
 * @api public
 */
module.exports = function StackExchange(options) {
    // Mitigate options to config.
    this.config = config;
    Object
        .keys(options || {})
        .forEach(function setConfig(key) {
            config.set(key, options[key]);
        });

    // Expose methods.
    this.questions = questions;
};
