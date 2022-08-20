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
  it('should parse superuser.com links', () => {
    const url = 'https://superuser.com/questions/480950/how-to-decompress-a-bz2-file'
    console.log(fun(url))
    assert.deepEqual(fun(url), {
      site: 'superuser',
      questionId: '480950'
    })
  })
  it('should return nul on links without id', () => {
    const url = 'https://superuser.com/questions/questions/tagged/read?sort=votes&pageSize=50'
    assert.deepEqual(fun(url), null)
  })
})
