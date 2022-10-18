const colors = require('colors')
const axios = require('axios')
const os = require('os')

const apiHost = process.env.HOW2_API || 'https://how2terminal.com'
const siteHost = process.env.HOW2_SITE || 'https://how2terminal.com'

function langFromPlatform () {
  switch (os.platform()) {
    case 'win32':
      return 'powershell'
    case 'darwin':
    case 'linux':
    case 'freebsd':
    case 'openbsd':
    default:
      return 'bash'
  }
}

async function main (text, lang, token, run) {
  try {
    lang = lang || langFromPlatform()
    const resp = await axios.get(`${apiHost}/api/complete`, {
      params: { text, lang, token }
    })
    const cmd = resp.data.choices[0].text
    console.log(colors.yellow(cmd))
    return true
  } catch (exc) {
    if (exc.response) {
      if (exc.response.status === 400) {
        // Invalid token
        console.log(exc.response.data.message)
        process.exit(1)
        return false
      } else if (exc.response.status === 402) {
        // Quota exhausted
        console.log(exc.response.data.message)
        return false
      } else {
        console.error('Status Code: ', exc.response.status)
        if (exc.response.data) {
          console.error(exc.response.data)
        }
        return false
      }
    }
    // Default error
    console.error('We are sorry, cannot contact our servers at the moment.')
    // console.error(exc.stack)
    return false
  }
}

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function cliLogin () {
  // TODO https://thecodebarbarian.com/oauth-in-nodejs-cli-apps.html
  const respLogin = await axios.get(`${apiHost}/api/login-key/new`)
  const openurl = require('openurl')
  const loginKeyParam = encodeURI(respLogin.data.loginKey)
  openurl.open(`${siteHost}/cli-login?loginKey=${loginKeyParam}`, function () {
    console.log('callback', arguments)
  })
  // Keep checking if the login is valid for 30 min
  const startTime = new Date()
  console.log('Waiting for your login...')
  while (new Date() - startTime < 30 * 60 * 1000) {
    try {
      const respCheck = await axios.get(`${apiHost}/api/login-key/get-token?loginKey=${loginKeyParam}`)
      if (respCheck.status === 200) {
        return true
      }
    } catch (exc) {
      console.log(exc.response.status)
      await sleep(3000)
    }
  }
  return false
}

module.exports = { main, cliLogin }
