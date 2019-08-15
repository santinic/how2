var assert = require('chai').assert;
var googleSearch = require('../lib/how2').googleSearch;

describe('search', () => {
  it('should find tail -f', done => {
    googleSearch('read file while is changing')
      .then(({ links, titles }) => {
        assert.isAbove(links.length, 5);
        assert.isTrue(
          titles[0].indexOf('Output file contents while they change') !== -1
        );
        done();
      })
      .catch(err => assert(false));
  });

  it('should not find any result', done => {
    googleSearch('')
      .then(({ links }) => {
        assert.lengthOf(links, 0);
        done();
      })
      .catch(err => assert(false));
  });
});
