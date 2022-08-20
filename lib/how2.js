const _ = require('lodash')
const assert = require('assert')
const spinner = require('simple-spinner')
const colors = require('colors/safe')
const googleIt = require('google-it')
const stackexchange = require('./stackexchange')

const log = require('./log')
const utils = require('./utils')
const ui = require('./ui')

const STACKEXCHANGE_OPTIONS = {
  version: 2.2
}
const SPINNER_OPTIONS = {
  doNotBlock: true
}

// eslint-disable-next-line new-cap
const context = new stackexchange(STACKEXCHANGE_OPTIONS)

async function fetchQuestionAnswers (parsedLink) {
  assert(parsedLink)
  const questionCriteria = {
    filter: '!-*f(6s6U8Q9b' // body_markdown and link
  }
  questionCriteria.site = parsedLink.site

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
    log.error('You are doing too many requests to Google. You need to wait a bit before trying ' +
                'again.')
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

async function googleSearch (text, lang) {
  if (!text) return new Promise((resolve) => resolve([]))

  const site = lang ? `site:stackoverflow.com ${lang}` : 'site:unix.stackexchange.com'
  const searchQuery = `${site} ${text}`

  return googleIt({ query: searchQuery, limit: 20, disableConsole: true }).then((res) =>
    res.filter((el) => !el.link.startsWith('https://translate.google.com/translate?')))
}

function selectAnswer ({ title, text, answers, lang, index, remember }) {
  spinner.stop()
  if (answers.length === 0) {
    log.error('Cannot find any reasonable answer for your query.')
    if (!lang) {
      console.log(`To get the best answers, make sure you specify the language with ${colors.blue('-l:')}`)
      console.log(`example: $ how2 ${colors.blue('-l python')} permutations list`)
      console.log(`example: $ how2 ${colors.blue('-l ruby')} permutations list`)
    }
    process.exit(1)
  }

  const markdown = utils.toEscapedMarkdown(answers[index].body_markdown)

  console.log(colors.underline.green(`${title}\n`))
  console.log(markdown)

  console.log(`(${colors.underline.blue(answers[index].link)})\n`)

  console.log('Press SPACE for more choices, any other key to quit.')
  require('keypress')(process.stdin)
  process.stdin.setRawMode(true)
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

async function onAfterSearch (text, searchResults, lang, index) {
  if (searchResults.length === 0) {
    log.error('Sorry, I cannot find any reasonable answer for your query.')
    process.exit(1)
  }

  const parsedLink = utils.parseStackoverflowQuestionId(searchResults[index].link)
  const { title } = searchResults[index]
  const remember = searchResults
  try {
    const answers = await fetchQuestionAnswers(parsedLink)
    selectAnswer({ title, text, answers, lang, index, remember })
  } catch (err) {
    log.error(err)
    process.exit(1)
  }
}

function onAfterInteractiveSearch (searchResults) {
  spinner.stop()

  if (searchResults.length === 0) {
    log.error('Sorry, I cannot find any reasonable answer for your query.')
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

async function main (text, lang) {
  spinner.start(SPINNER_OPTIONS)
  try {
    const searchResults = await googleSearch(text, lang)
    onAfterSearch(text, searchResults, lang, 0)
  } catch (err) {
    onErrorSearch(err)
  }
}

async function interactiveMain (text, lang, remember) {
  ui.start()
  spinner.start(SPINNER_OPTIONS)

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

module.exports = {
  main,
  googleSearch,
  interactiveMain
}

require('process').on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
