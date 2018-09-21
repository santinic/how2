var assert = require('chai').assert;
var search = require('../lib/how2').search;

describe('search', () => {
    it('should find tail -f', (done) => {
        search('read file while is changing', undefined).then(({links}) => {
            assert.isAbove(links.length, 5);
            assert.isTrue(links[0].title.indexOf('Output file contents while they change') !== -1);
            done();
        }).catch((err) => assert(false));
    });

    it('should not find any result', (done) => {
        search('', null).then(({links}) => {
            assert.lengthOf(links, 0);
            done();
        }).catch((err) => assert(false));
    });
});
