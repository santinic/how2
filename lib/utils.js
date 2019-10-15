var _ = require('lodash');
var htmlentities = require('ent');
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');
var colors = require('colors');

marked.setOptions({
    // Define custom renderer
    renderer: new TerminalRenderer({
        unescape: true,
    })
});

function stripStackOverflow(title) {
    var split = title.split(' - ');
    if(split.length === 3) {
        split.pop();
        return split.join(' - ');
    }
    if(split.length === 2) {
        var last = _.last(split);
        if(last.indexOf('Stack') !== -1 || last.indexOf('Unix') !== -1) {
            split.pop();
            return split.join('-');
        }
    }
    return title;
}

function parseStackoverflowQuestionId(link) {
    var re,
        matches;
    if(link && link.indexOf('stackoverflow.com') !== -1) {
        re = /.*stackoverflow.com\/questions\/(\d+)\//;
        matches = re.exec(link);
        if(!matches || matches.length < 2) return null;
        if(matches) {
            return {
                site: 'stackoverflow',
                questionId: matches[1]
            };
        }
    }
    else if(link && link.indexOf('stackexchange.com') !== -1) {
        re = /.*\/\/(.*).stackexchange.com\/questions\/(\d+)\//;
        matches = re.exec(link);
        if(!matches || matches.length < 3) return null;
        return {
            site: matches[1],
            questionId: matches[2]
        };
    }
    else return null;
}

function isValidGoogleLink(link) {
    return parseStackoverflowQuestionId(link.link) !== null;
}

function kbdTagFix(escapedMarkdown)
{
    var kbdEncasedGlobalCaseInsesitive = /<KBD>(.*?)<\/KBD>/gi;
    return escapedMarkdown.replace(kbdEncasedGlobalCaseInsesitive, colors.gray("[ "+colors.white.bold("$1")+" ]"));
}

function toEscapedMarkdown(markdown) {
     return kbdTagFix(htmlentities.decode(marked(markdown)));
}

module.exports = {
    parseStackoverflowQuestionId: parseStackoverflowQuestionId,
    stripStackOverflow: stripStackOverflow,
    isValidGoogleLink: isValidGoogleLink,
    toEscapedMarkdown: toEscapedMarkdown,
    kbdTagFix : kbdTagFix,
    marked: marked
};
