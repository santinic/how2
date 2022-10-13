const { assert } = require('chai')
const fun = require('../lib/utils').parseStackoverflowQuestionId
const { fetchQuestionAnswers } = require('../lib/how2')

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
    assert.deepEqual(fun(url), { hostname: 'stackoverflow.com', questionId: '39934' })
  })
  it('should parse superuser.com links', () => {
    const url = 'https://superuser.com/questions/480950/how-to-decompress-a-bz2-file'
    console.log(fun(url))
    assert.deepEqual(fun(url), { hostname: 'superuser.com', questionId: '480950' })
  })
  it('should return null on links without id', () => {
    const url = 'https://superuser.com/questions/questions/tagged/read?sort=votes&pageSize=50'
    assert.deepEqual(fun(url), null)
  })
  it('should handle askubuntu.com', () => {
    const url = 'https://askubuntu.com/questions/341178/how-do-i-get-details-about-a-package-which-isnt-installed'
    assert.deepEqual(fun(url), {
      hostname: 'askubuntu.com',
      questionId: '341178'
    })
  })
  it('pt.stackoverflow.com (subdomains)', () => {
    const url = 'https://pt.stackoverflow.com/questions/341178/how-do-i-get-details-about-a-package-which\n'
    assert.deepEqual(fun(url), { hostname: 'pt.stackoverflow.com', questionId: '341178' })
  })
  it('should handle all stackexchange subdomains', () => {
    const allSubomainsExamples = [
      'stackoverflow.com',
      'serverfault.com',
      'superuser.com',
      'askubuntu.com',
      'stackapps.com',
      // 'mathoverflow.net',
      'pt.stackoverflow.com',
      'ai.stackexchange.com'
    ]
    allSubomainsExamples.forEach(domain => {
      const url = `https://${domain}/questions/341178/how-do-i-get-details-about-a-package-which`
      // console.log(url)
      const ret = fun(url)
      assert.equal(ret.hostname, domain)
      assert.equal(ret.questionId, 341178)
    })
  })
})

describe('fetchQuestionAnswer', () => {
  it('should work', (done) => {
    const parsedLink = { hostname: 'superuser.com', questionId: '215629' }
    fetchQuestionAnswers(parsedLink).then(res => {
      console.log(res)
      assert.isNotNull(res)
      assert.isTrue(res.length > 0)
      done()
    })
  })
})
