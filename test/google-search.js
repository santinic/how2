var assert = require('chai').assert;
var search = require('../lib/how2').search;

describe('search', function() {
    it('should find tail -f', function (done) {
        var ret = search('read file while is changing', null, function(links, titles) {
            assert.isAbove(links.length, 5);
            assert.isTrue(links[0].title.indexOf('Output file contents while they change') !== -1);
            done();
        });
    });
});
