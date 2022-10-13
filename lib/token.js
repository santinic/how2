const fs = require('fs')
const os = require('os')
const path = require('path')

function getConfFilePath () {
  const homedir = os.homedir()
  const name = '.how2.json'
  return path.join(homedir, name)
}

function getToken () {
  const filePath = getConfFilePath()
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath).toString()).token
  } else return null
}

function setToken (tokenHash) {
  tokenHash = String(tokenHash)
  if (tokenHash === true) {
    console.error('❌ Must provide a token. Get one at https://how2terminal.com/quota')
    process.exit(1)
  }
  if (tokenHash.length < 36) {
    console.error('❌ Token should be at least 36 characters. Double check')
    process.exit(1)
  }
  const filePath = getConfFilePath()
  const val = JSON.stringify({ token: tokenHash })
  fs.writeFileSync(filePath, val)
  console.log('✅ Token set, thank you.')
}

module.exports = { setToken, getToken }
