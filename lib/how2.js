const _ = require('lodash')
const spinner = require('simple-spinner')
const colors = require('colors/safe')
const googleIt = require('google-it')
const stackexchange = require('./stackexchange')

const log = require('./log')
const utils = require('./utils')
const ui = require('./ui')

const context = new stackexchange({ version: 2.2 })

async function fetchQuestionAnswers (parsedLink) {
  const questionCriteria = {
    filter: '!-*f(6s6U8Q9b' // body_markdown and link
  }
  questionCriteria.site = parsedLink.hostname

  try {
    const results = await context.questions.answers(questionCriteria, [parsedLink.questionId])
    const answers = _.sortBy(results.items, (answer) => -answer.score)
    return answers
  } catch (err) {
    ui.stop()
    log.error('Cannot fetch answers from Stackoverflow.')
    log.error(err)
    return null
  }
}

function onErrorSearch (err) {
  ui.stop()
  const msg = err.toString()

  if (msg.indexOf('have detected unusual traffic') !== -1) {
    log.error('You are doing too many requests to Google. You need to wait a bit before trying again.')
  } else if (msg.indexOf('ENOTFOUND') !== -1) {
    log.error('Cannot connect to Google. Make sure you are connected.')
    log.error(err)
  } else {
    log.error('Cannot connect to Google.')
    log.error(err)
    log.error(err.stack)
  }
  process.exit(1)
}

const shellSearchDomains = { 'superuser.com': 1, 'askubuntu.com': 1, 'stackoverflow.com': 1 }

function domainFilter (el) {
  const url = new URL(el.link)
  return url.hostname.endsWith('stackexchange.com') || url.hostname in shellSearchDomains
}

async function googleSearch (text, lang) {
  if (!text) return new Promise((resolve) => resolve([]))

  // const site = lang ? `site:stackoverflow.com ${lang}` : 'site:superuser.com'
  // const searchQuery = `${site} ${text}`

  const searchQuery = text
  return googleIt({ query: searchQuery, limit: 20, disableConsole: true }).then(res => res.filter(domainFilter))
}

function selectAnswer ({ title, text, answers, lang, index, remember, askInteractive }) {
  spinner.stop()
  if (answers.length === 0) {
    log.error('Cannot find any reasonable answer for your query.')
    // if (!lang) {
    //   console.log(`To get the best answers, make sure you specify the language with ${colors.blue('-l:')}`)
    //   console.log(`example: $ how2 ${colors.blue('-l python')} permutations list`)
    //   console.log(`example: $ how2 ${colors.blue('-l ruby')} permutations list`)
    // }
    process.exit(1)
  }

  const markdown = utils.toEscapedMarkdown(answers[index].body_markdown)

  console.log(colors.underline.green(`${title}\n`))
  console.log(markdown)

  console.log(`(${colors.underline.blue(answers[index].link)})\n`)

  if (askInteractive) {
    console.log('Press SPACE for more choices, any other key to quit.')
    require('keypress')(process.stdin)
    if (process.stdin.setRawMode) process.stdin.setRawMode(true)
    process.stdin.on('keypress', onKeypress)

    function onKeypress (_, key) {
      if (key) {
        if (key.name === 'space') {
          process.stdin.removeListener('keypress', onKeypress)
          return interactiveMain(text, lang, remember)
        }
        process.exit(0)
      }
    }
  }
}

function onAfterInteractiveSearch (searchResults) {
  spinner.stop()

  if (searchResults.length === 0) {
    log.error("Sorry, can't find answers for your query.")
    process.exit(1)
  }
  ui.showGoogleList(searchResults, async (index) => {
    const parsedLink = utils.parseStackoverflowQuestionId(
      searchResults[index].link
    )
    try {
      const answers = await fetchQuestionAnswers(parsedLink)
      showAnswers(answers)
    } catch (err) {
      onErrorSearch(err)
    }
  })
}

function showAnswers (answers) {
  ui.showAnswers(answers, (index) => {
    const selected = answers[index]
    if (selected) {
      ui.showAnswer(selected)
    }
  })
}

async function main (text, lang, askInteractive) {
  console.log('Searching StackOverflow...')
  spinner.start({ doNotBlock: true })
  try {
    const searchResults = await googleSearch(text, lang)
    if (searchResults.length === 0) {
      log.error('Sorry, I cannot find any reasonable answer for your query.')
      process.exit(1)
    }
    const index = 0
    const parsedLink = utils.parseStackoverflowQuestionId(searchResults[index].link)
    const { title } = searchResults[index]
    const remember = searchResults
    try {
      const answers = await fetchQuestionAnswers(parsedLink)
      selectAnswer({ title, text, answers, lang, index, remember, askInteractive })
    } catch (err) {
      log.error(err)
      process.exit(1)
    }
  } catch (err) {
    onErrorSearch(err)
  }
}

async function interactiveMain (text, lang, remember) {
  ui.start()
  spinner.start({ doNotBlock: true })

  if (!remember) {
    try {
      const searchResults = await googleSearch(text, lang)
      onAfterInteractiveSearch(searchResults)
    } catch (err) {
      onErrorSearch(err)
    }
  } else {
    onAfterInteractiveSearch(remember)
  }
}

module.exports = { main, interactiveMain, googleSearch, fetchQuestionAnswers }
