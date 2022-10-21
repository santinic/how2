const { yellow, red, green } = require('colors')

const HELP =
`how2 version 3.0.2 - https://how2terminal.com
usage: how2 [-s] query 

Examples:
how2 ${yellow('list apt packages by size')}\t\t${red('# Use AI to answer')}
how2 ${green('-s')} ${yellow('unzip tar')}\t\t\t${red('# Search StackOverflow')}

how2 ${green('--login')}\t\t\t\t${red('# Login to get your tokens')}
how2 ${green('--set-token')} 278384ed-3d26-47f2...\t${red('# Set token (in ~/.how2.json)')}
how2 ${green('--get-token')}\t\t\t${red('# Print current token ')}
how2 ${green('--rm-token')}\t\t\t\t${red('# Delete current token')}

More options:
${green('-p')}\t\t\t\t\t${red('# Just print, no interactions')}
${green('--update')}\t\t\t\t${red('# Check new releases of how2')}
`
// how2 ${green('-l python ')} ${yellow('permutations of a list')}

const { argv } = require('yargs')
  .boolean('a') // AI mode
  .boolean('s') // Search StackOverflow
  .boolean('p') // plain text, no interactions on animations
  .option('login')
  .option('set-token', { alias: 't' }) // Set token for your user
  .option('get-token')
  .option('rm-token')
  .option('update', { alias: 'u' }) // Check for new releases
  .help(HELP)

async function main () {
  if (argv['set-token']) {
    const { setToken } = require('./token')
    setToken(argv['set-token'])
    process.exit(0)
  }
  if (argv['get-token']) {
    const { getToken } = require('./token')
    console.log(getToken())
    process.exit(0)
  }
  if (argv['rm-token']) {
    const { rmToken } = require('./token')
    rmToken()
    process.exit(0)
  }
  if (argv.login) {
    const srv = require('./srv')
    await srv.cliLogin()
    process.exit(0)
    // if (logged) {
    //   console.log('Logged.')
    // } else {
    //   console.error('Cannot log.')
    // }
  }
  if (argv.update) {
    const update = require('./update')
    await update.check()
    process.exit()
  }
  if (argv._.length === 0) {
    console.log(HELP)
    process.exit(0)
  }

  const text = argv._.join(' ')

  // Check -l is used properly
  // if (!lang) {
  //   lang = checkTextContainsLang(text)
  // }

  function stdMain () {
    const how2 = require('./how2')
    const plainText = !argv.p
    how2.main(text, argv.l, plainText)
  }

  if (argv.s) {
    stdMain()
  } else {
    const srv = require('./srv')
    const { getToken } = require('./token')
    const ret = await srv.main(text, argv.l, getToken())
    if (!ret) stdMain()
  }
}

main()
