var colors = require('colors');

function error(str) {
    console.error(colors.red(str));
}

function debug() {
    Function.apply.call(console.log, console, arguments);
}

module.exports = {
    error: error,
    debug: debug
};
