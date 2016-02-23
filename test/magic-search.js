var assert = require('chai').assert;
var magicSearch = require('../lib/how2').magicSearch;

describe('magic search', function() {
    xit('should find tail -f', function (done) {
        var ret = magicSearch('read file while is changing', null, function(links, titles) {
            assert.isAbove(links.length, 5);
            assert.isTrue(links[0].title.indexOf('Output file contents while they change') !== -1);
            done();
        });
    });
});
