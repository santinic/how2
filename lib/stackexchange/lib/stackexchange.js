'use strict';

var util = require('utile')
    , config = require('./config')
    , search = require('./methods/search')
    , questions = require('./methods/questions')
    , answers = require('./methods/answers')
    , users = require('./methods/users')
    , tags = require('./methods/tags');

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
    Object.keys(options || {}).forEach(function setConfig(key) {
        config.set(key, options[key]);
    });

    // Expose methods.
    this.search = search;
    this.questions = questions;
    this.answers = answers;
    this.users = users;
    this.tags = tags;
};
