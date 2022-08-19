const { argv } = require('yargs')
  .boolean('i')
  .boolean('h')
  .alias('h', 'help')

const colors = require('colors')
const how2 = require('./how2')

const LANGS = ['python', 'javascript', 'ruby', 'perl', 'php', 'c++', 'zsh']
const how2Version = require('../package.json').version

const HELP = `how2 version ${how2Version} - by Claudio Santini - Paolo Cifariello
usage: how2 [-l python/ruby/etc.] "search string"\n
$ how2 ${colors.yellow('read file while is changing\n')}
$ how2 ${colors.blue('-l python ')} ${colors.yellow('permutations of a list')}\n`

function help () {
  console.log(HELP)
  process.exit(0)
}

function checkTextContainsLang (text) {
  const lower = text.toLowerCase()
  const detectedLang = LANGS.find((lang) => lower.indexOf(lang) !== -1)

  if (detectedLang) {
    console.log(colors.red(`You should use the option ${colors.blue('-l')} to specify the language.`))
    console.log(`example: $ how2 ${colors.blue(`-l ${detectedLang}`)} search text\n`)
  }

  return detectedLang
}

function main () {
  if (argv._.length === 0 || argv.h) {
    help()
  }
  const text = argv._.join(' ')
  let lang = argv.l

  if (!lang) {
    lang = checkTextContainsLang(text)
  }

  if (argv.i) { // interactive mode
    how2.interactiveMain(text, lang)
  } else { // normal mode
    how2.main(text, lang)
  }
}

main()
