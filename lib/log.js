const colors = require('colors')

function error (str) {
  console.error(colors.red(str))
}

function debug (...rest) {
  console.log(...rest)
}

module.exports = { error, debug }
