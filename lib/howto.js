var _ = require('lodash');
var stackexchange = require('./stackexchange/lib/stackexchange');
var google = require('google');
var ui = require('./ui');
var assert = require('assert');

var options = { version: 2.2 };
var context = new stackexchange(options);

function stripStackOverflow(title) {
    var split = title.split('-');
    if(split.length === 3) {
        split.pop();
        return split.join('-');
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

function selectedGoogleItemCallback(links, callback) {
    return function(index) {
        var selectedLink = links[index];
        // console.log(selectedLink)
        var parsedLink = parseStackoverflowQuestionId(selectedLink.link)
        fetchQuestionAnswers(parsedLink, callback);
    };
}

function fetchQuestionAnswers(parsedLink, callback) {
    assert(parsedLink);
    var questionCriteria = {
        filter: '!9YdnSM68f', // body_markdown
    };
    questionCriteria.site = parsedLink.site;
    // console.log(questionCriteria);
    context.questions.answers(questionCriteria, function(err, results){
        if(err) {
            ui.stop();
            console.error("Cannot fetch answers from Stackoverflow.");
            console.error(err);
            process.exit(1);
        }
        if(results.error_id) {
            ui.stop();
            console.error(results);
            process.exit(1);
        }

        // results.items.forEach(function(item) {
            // console.log(item);
            // console.log(item.score + marked(item.body_markdown) + '\n');
        // })

        var answers = _.sortBy(results.items, function(answer) {
            return - answer.score;
        });
        // console.log(results)
        callback(answers);

    }, [parsedLink.questionId]);
}

function googleError(err, links) {
    ui.stop();
    var msg = err.toString()

    if(msg.indexOf('have detected unusual traffic') !== -1) {
        console.error(
            "You are doing to many requests to Google. " +
            "You need to wait a bit before trying again.");
    }
    else if(msg.indexOf('ENOTFOUND') !== -1) {
        console.error("Cannot connect to Google. Make sure you are connected.");
        console.error(err);
    }
    else {
        console.error("Cannot connect to Google.");
        console.error(err);
    }
    process.exit(1);
}

function searchGoogle(text, lang, callback) {
    google.resultsPerPage = 40;
    var nextCounter = 0;

    // var site = 'site:stackoverflow.com';
    var site = 'site:stackexchange.com';
    var searchQuery = site + ' ' + text;

    google(searchQuery, function (err, next, links){
        if(err) {
            return googleError(err, links);
        }

        links = links.filter(function(link) {
            return link.title !== '';
        })
        .filter(isValidGoogleLink);

        var strippedTitles = links.map(function(link) {
            // console.log(links[i].title + ' - ' + links[i].link) // link.href is an alias for link.link
            // console.log(links[i].description + "\n")
            var title = stripStackOverflow(link.title);
            return title;
        });

        callback(links, strippedTitles);

        // if (nextCounter < 4) {
        // nextCounter += 1
        // if (next) next()
        // }
    })
}

function search(text, lang, callback) {
    return searchGoogle(text, lang, callback);
}

function main(text, lang) {
    ui.start();
    ui.showGoogling();
    search(text, lang, function(links, titles) {
        ui.showGoogleList(titles, selectedGoogleItemCallback(links, function(answers) {
            ui.showAnswers(answers, function(index) {
                var selected = answers[index];
                ui.showAnswer(selected);
            });
        }));
    });
}

function magic(text, lang) {
    var scanf = require('scanf');
    var colors = require('colors/safe');

    function scanfIndex() {
        var input;
        input = scanf('%d');
        return input;
    }

    function selectedAnswer(titles, answers, index) {
        var markdown = ui.toEscapedMarkdown(answers[index].body_markdown);

        var title = titles[index];
        console.log(colors.blue(title));
        console.log(colors.blue(Array(title.length).join('=')));
        console.log(markdown);

        // console.log('If you want to choose the questions use -i');

        // console.log('Alternative answers:');
        // titles = titles.slice(0, 10).map(function(title, i) {
        //     return title;
        // });
        // titles.forEach(function(title, i) {
        //     console.log(i+') '+title);
        // })
        // var index = scanfIndex();
        // selectedAnswer(titles, answers, index);
    }

    search(text, lang, function(links, titles) {
        var selectItem = selectedGoogleItemCallback(links, function(answers){
            selectedAnswer(titles, answers, 0);
        });
        selectItem(0);
     });
}

module.exports = {
    parseStackoverflowQuestionId: parseStackoverflowQuestionId,
    stripStackOverflow: stripStackOverflow,
    main: main,
    magic: magic
};
