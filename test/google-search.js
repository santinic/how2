var assert = require('chai').assert;
var googleSearch = require('../lib/how2').googleSearch;

describe('search', () => {
    it('should find tail -f', (done) => {
        googleSearch('read file while is changing', undefined).then((searchResults) => {
            assert.isAbove(searchResults.length, 5);
            assert.isTrue(searchResults[0].title.indexOf('Output file contents while they change') !== -1);
            done();
        }).catch((err) => done(err));
    });

    it('should not find any result', (done) => {
        googleSearch('', null).then((searchResults) => {
            assert.lengthOf(searchResults, 0);
            done();
        }).catch((err) => done(err));
    });
});
