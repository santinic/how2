const { googleSearch } = require('../lib/how2')
const { assert } = require('chai')
const utils = require('../lib/utils')

describe('core logic', () => {
  it('decompress bz2', async () => {
    const text = 'decompress bz2'
    const lang = null

    // Search
    const searchResults = await googleSearch(text, lang)
    console.log(searchResults)
    assert.isAbove(searchResults.length, 1)
    assert.include((searchResults.map(r => r.snippet).join(' | ')), 'bzip')

    // Parse first link
    const parsedLink = utils.parseStackoverflowQuestionId(searchResults[0].link)
    console.log(parsedLink)
    assert.equal(parsedLink.hostname, 'superuser.com')
    assert.isDefined(parsedLink.questionId)

    // First result title contains at least .bz2
    const { title } = searchResults[0]
    assert.include(title, '.bz2')
  })
  it('-l python permutations', async () => {
    const text = 'permutations of a list'
    const lang = 'python'

    // Search
    const searchResults = await googleSearch(text, lang)
    // console.log(searchResults)
    assert.isAbove(searchResults.length, 1)
    assert.include((searchResults.map(r => r.snippet).join(' | ')), 'itertools')

    // Parse first link
    const parsedLink = utils.parseStackoverflowQuestionId(searchResults[0].link)
    // console.log(parsedLink)
    assert.equal(parsedLink.hostname, 'stackoverflow.com')
    assert.isDefined(parsedLink.questionId)
  })
})
