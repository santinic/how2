const { assert } = require('chai')
const { googleSearch } = require('../lib/how2')

describe('search', () => {
  it('should find tail -f', (done) => {
    googleSearch('read file while is changing shell', undefined).then((results) => {
      assert.isAbove(results.length, 2)
      assert.include((results.map(r => r.snippet).join(' | ')), 'tail -f')
      done()
    }).catch((err) => done(err))
  })

  it('should not find any result', (done) => {
    googleSearch('', null).then((searchResults) => {
      assert.lengthOf(searchResults, 0)
      done()
    }).catch((err) => done(err))
  })
})
