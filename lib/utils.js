const _ = require('lodash')
const htmlentities = require('ent')
const marked = require('marked')
const TerminalRenderer = require('marked-terminal')

const stackexchangeDomains = new Map([
  'stackoverflow.com',
  'serverfault.com',
  'superuser.com',
  'askubuntu.com',
  'stackapps.com',
  'mathoverflow.net',
  'stackexchange.com'
].map(d => [d, 1]))

const urlRegex = /.*\/questions\/(\d+)\//

marked.setOptions({
  // Define custom renderer
  renderer: new TerminalRenderer({ unescape: true })
})

function stripStackOverflow (title) {
  const split = title.split(' - ')
  if (split.length === 3) {
    split.pop()
    return split.join(' - ')
  }
  if (split.length === 2) {
    const last = _.last(split)
    if (last.indexOf('Stack') !== -1 || last.indexOf('Unix') !== -1) {
      split.pop()
      return split.join('-')
    }
  }
  return title
}

function parseStackoverflowQuestionId (link) {
  try {
    const url = new URL(link)
    if (
      url.hostname.endsWith('stackoverflow.com') ||
      url.hostname.endsWith('stackexchange.com') ||
      stackexchangeDomains.has(url.hostname)
    ) {
      const matches = urlRegex.exec(link)
      if (!matches || matches.length < 2) return null
      if (matches) {
        return {
          hostname: url.hostname,
          questionId: matches[1]
        }
      }
    }
  } catch (exc) {}
  return null
}

function isValidGoogleLink (link) {
  return parseStackoverflowQuestionId(link.link) !== null
}

function toEscapedMarkdown (markdown) {
  return htmlentities.decode(marked.parse(markdown))
}

module.exports = {
  parseStackoverflowQuestionId,
  stripStackOverflow,
  isValidGoogleLink,
  toEscapedMarkdown,
  marked
}
