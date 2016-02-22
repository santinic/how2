var _ = require('lodash');
var htmlentities = require('ent');
var marked = require('marked');
var TerminalRenderer = require('marked-terminal');

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
    if(link.indexOf('stackoverflow.com') !== -1) {
        var re = /.*stackoverflow.com\/questions\/(\d+)\//;
        var matches = re.exec(link);
        if(matches) {
            return {
                site: 'stackoverflow',
                questionId: matches[1]
            }
        }
    }
    else if(link.indexOf('stackexchange.com') !== -1) {
        var re = /.*\/\/(.*).stackexchange.com\/questions\/(\d+)\//;
        var matches = re.exec(link);
        // console.log(matches)
        var site = null,
            questionId = null;
        if (matches && matches[1]){
            site = matches[1];
        }
        if (matches && matches[2]){
            questionId = matches[2];
        }
        return {
            site: site,
            questionId: questionId
        };
    }
    else return null;
}

function isValidGoogleLink(link) {
    var re = /.*\/questions\/.*/;
    return re.exec(link.link) !== null;
}

function toEscapedMarkdown(markdown) {
     return htmlentities.decode(marked(markdown));
}

module.exports = {
    parseStackoverflowQuestionId: parseStackoverflowQuestionId,
    stripStackOverflow: stripStackOverflow,
    isValidGoogleLink: isValidGoogleLink,
    toEscapedMarkdown: toEscapedMarkdown,
    marked: marked
};
