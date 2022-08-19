let checkResult = null

function checkForUpdates () {
  const npmLatest = require('npm-latest')
  const packageJson = require('../package.json')
  const colors = require('colors')
  const semver = require('semver')

  npmLatest('how2', { timeout: 1500 }, (err, npm) => {
    if (err) {
      console.error(err)
      return
    }
    if (semver.gt(npm.version, packageJson.version)) {
      checkResult = colors.yellow(
        `\nA new version of how2 is available: ${npm.version}\n` +
                `Run ${colors.blue('npm update -g how2')} to update.\n`
      )
    }
  })
}

function getResult () {
  return checkResult
}

module.exports = {
  checkForUpdates,
  getResult
}
