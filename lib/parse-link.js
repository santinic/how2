var url = require('url');

function parseLink(link) {
    // var re = /.*stackoverflow.com\/questions\/(\d+)\//;
    var parsed = url.parse(link);

    parsed.hostname;
}

module.exports = parseLink;
