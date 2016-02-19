var _ = require('lodash');

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
                site: null,
                questionId: matches[1]
            }
        }
    }
    else if(link.indexOf('stackexchange.com') !== -1) {
        var re = /.*\/\/(.*).stackexchange.com\/questions\/(\d+)\//;
        var matches = re.exec(link);
        // console.log(matches)
        return {
            site: matches[1],
            questionId: matches[2]
        };
    }
    else return null;
}

function isValidGoogleLink(link) {
    var re = /.*\/questions\/.*/;
    return re.exec(link.link) !== null;
}

module.exports = {
    parseStackoverflowQuestionId: parseStackoverflowQuestionId,
    stripStackOverflow: stripStackOverflow,
    isValidGoogleLink: isValidGoogleLink
};
