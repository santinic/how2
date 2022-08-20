const _ = require('lodash')
const blessed = require('blessed')
const htmlentities = require('ent')
const colors = require('colors')
const marked = require('marked')

const utils = require('./utils')
const updates = require('./updates')

let screen
let googleList
let answersList
let logBox

function exit () {
  screen.destroy()
  const msg = updates.getResult()
  if (msg) {
    console.error(msg)
  }
  process.exit(0)
}

function start () {
  updates.checkForUpdates()

  screen = blessed.screen({ smartCSR: true, autoPadding: true })

  screen.key(['C-c'], (ch, key) => {
    exit()
  })

  const logText = `${colors.bgBlue.white.bold(' Enter/Space ')} open link ` +
    `${colors.bgBlue.white.bold(' b ')} open browser ` +
    `${colors.bgBlue.white.bold(' Esc ')} close window`
  logBox = blessed.box({ width: '100%', top: '100%-1', content: logText })
  screen.append(logBox)
  screen.render()
}

function listStyle () {
  return {
    selectedBg: '#b2dfdb',
    selectedFg: 'black',
    mouse: true,
    keys: true,
    vi: true
  }
}

function showGoogling () {
  const box = blessed.box({ content: 'Googling...' })
  screen.append(box)
  screen.render()
}

function showGoogleList (searchResults, callback) {
  const titles = searchResults.map((el) => el.title)
  const options = {
    parent: screen,
    width: '100%',
    height: '100%-1',
    top: 'center',
    left: 'center',
    padding: 1,
    title: 'Select Answer:'
    // mouse: true
  }
  _.extend(options, listStyle())
  googleList = blessed.list(options)

  googleList.setItems(titles)

  googleList.prepend(new blessed.Text({ content: 'Select one code tip:' }))

  googleList.on('select', function (_) {
    callback(this.selected)
  })

  googleList.key(['space', 'o'], () => {
    googleList.enterSelected()
    screen.render()
  })

  googleList.key(['escape', 'q'], () => {
    exit()
  })

  googleList.key(['b'], function () {
    const { link } = searchResults[this.selected]
    try {
      require('openurl').open(link)
    } catch (e) {
      console.error(e)
    }
  })

  googleList.select(0)
  googleList.focus()
  screen.render()
}

function makeTitleForAnswer (answer) {
  const withColors = marked.parse(answer.body_markdown)

  const lines = withColors.split('\n')

  let firstLine
  for (let i = 0; i < lines.length; i++) {
    firstLine = lines[i]
    if (firstLine !== '') break
  }
  firstLine = htmlentities.decode(firstLine)
  const score = `(${answer.score}) `
  return score + firstLine
}

function showAnswers (answers, callback) {
  const listBox = blessed.box({
    top: 'center',
    left: 'center',
    width: '90%',
    height: '90%',
    border: {
      type: 'line'
    },
    tags: true
  })

  const listOptions = {
    parent: listBox,
    border: {
      type: 'bg'
    }
  }
  _.extend(listOptions, listStyle())
  answersList = blessed.list(listOptions)

  answersList.setItems(answers.map(makeTitleForAnswer))

  answersList.on('select', function () {
    callback(this.selected)
  })

  answersList.key(['space', 'o'], () => {
    answersList.enterSelected()
    screen.render()
  })

  answersList.key(['b'], function () {
    const answer = answers[this.selected]
    require('openurl').open(answer.link)
  })

  answersList.key(['escape', 'q'], () => {
    screen.remove(listBox)
    googleList.focus()
    screen.render()
  })

  listBox.append(answersList)
  answersList.focus()
  screen.append(listBox)
  screen.render()
}

function showAnswer (answer) {
  const text = utils.toEscapedMarkdown(answer.body_markdown)

  const answerBox = blessed.box({
    top: 'center',
    left: 'center',
    width: '80%',
    height: '80%',
    border: {
      type: 'line'
    },
    padding: 1,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      border: {
        bg: 'yellow'
      },
      bg: 'yellow'
    },
    keys: true,
    vi: true
    // mouse: true
  })

  answerBox.setContent(`${text}\n(${colors.underline.blue(answer.link)})`)

  answerBox.key(['escape', 'q'], () => {
    screen.remove(answerBox)
    answersList.focus()
    screen.render()
  })

  answerBox.key(['b'], (event) => {
    require('openurl').open(answer.link)
  })

  screen.append(answerBox)
  answerBox.focus()
  screen.render()
}

function magicSelect (rows) {
  screen = blessed.screen({ autoPadding: true })
  const list = blessed.list({})
  list.setItems(rows)
  screen.append(list)
  screen.render()
}

module.exports = {
  start,
  stop: () => (screen ? screen.destroy() : undefined),
  showGoogling,
  showGoogleList,
  showAnswers,
  showAnswer,
  magicSelect
}
