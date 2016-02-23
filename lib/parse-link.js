var url = require('url');

function startsWith(a, b) {
    return a.indexOf(b) === 0;
}

function parseLink(link) {
    // var re = /.*stackoverflow.com\/questions\/(\d+)\//;
    var parsed = url.parse(link);

    parsed.hostname;
}

module.exports = parseLink;
