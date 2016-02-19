var colors = require('colors');

function error(str) {
    console.error(colors.red(str));
}

// function info() {
//     Function.apply.call(console.log, console, arguments);
// }

function debug() {
    Function.apply.call(console.log, console, arguments);
}

module.exports = {
    error: error,
    // info: info,
    debug: debug
};
