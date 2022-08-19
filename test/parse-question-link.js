const { assert } = require('chai')
const fun = require('../lib/utils').parseStackoverflowQuestionId

describe('parseStackoverflowQuestionId', () => {
  it('should not recognize empty strings', () => {
    assert.equal(fun(''), null)
  })
  it('should not recognize links that are not from stackexchange/overflow', () => {
    const url = 'http://someother.com/questions/2342/title'
    assert.equal(fun(url), null)
  })
  it('should parse stackoverflow links', () => {
    const url = 'http://stackoverflow.com/questions/39934/is-it-possible-to'
    assert.deepEqual(fun(url), {
      site: 'stackoverflow',
      questionId: '39934'
    })
  })
  it('should parse unix.stackoverflow links', () => {
    const url = 'http://unix.stackexchange.com/questions/39934/is-it-possible-to'
    assert.deepEqual(fun(url), {
      site: 'unix',
      questionId: '39934'
    })
  })
  it('should return nul on links without id', () => {
    const url = 'http://unix.stackexchange.com/questions/tagged/read?sort=votes&pageSize=50'
    assert.deepEqual(fun(url), null)
  })
})
