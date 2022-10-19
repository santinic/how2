const versionCheck = require('github-version-checker')
const colors = require('colors')

async function check () {
  const options = {
    repo: 'how2',
    owner: 'santinic',
    currentVersion: require('../package.json').version
  }
  try {
    const update = await versionCheck(options)
    if (update) {
      console.log('You are on version ' + options.currentVersion)
      console.log(`A newer release is available: ${update.name}.`)
      console.log()
      console.log(`To update with homebrew: ${colors.yellow('brew update how2')}`)
      console.log(`To update with npm:      ${colors.yellow('npm install -g how2@latest')}`)
      console.log()
      console.log(`For other ways to update, visit ${colors.blue('https://how2terminal.com')}.`)
    } else {
      console.debug('You are up to date:', options.currentVersion)
    }
  } catch (e) {
    console.error(e)
  }
}

module.exports = { check }
