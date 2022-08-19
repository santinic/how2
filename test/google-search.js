const { assert } = require('chai')
const { googleSearch } = require('../lib/how2')

describe('search', () => {
  it('should find tail -f', (done) => {
    googleSearch('read file while is changing', undefined).then((searchResults) => {
      console.log(searchResults)
      assert.isAbove(searchResults.length, 5)
      assert.isTrue(searchResults[0].title.indexOf('Output file contents while they change') !== -1)
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
