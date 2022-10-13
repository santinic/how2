const mem = {
  api: 'api.stackexchange.com',
  protocol: 'https:',
  site: 'stackoverflow',
  version: 2.2,
}

function set(key, val) {
  mem[key] = val
}

function get(key) {
  return mem[key]
}


module.exports = { set, get }

// Original based on nconf:
//
// const nconf = require('nconf');
//
// // Default configuration.
// nconf
//   .use('memory')
//   .defaults({
//     api: 'api.stackexchange.com', protocol: 'https:', site: 'stackoverflow', version: 2.2,
//   });
//
// // Expose config
// module.exports = nconf;
