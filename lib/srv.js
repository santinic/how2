const colors = require('colors')
const axios = require('axios')
const os = require('os')

const host = process.env.HOW2_ENDPOINT || 'https://how2terminal.com'

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
    const resp = await axios.get(`${host}/api/complete`, {
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

module.exports = { main }
