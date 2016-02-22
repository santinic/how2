var _ = require('lodash');
var stackexchange = require('./stackexchange/lib/stackexchange');
var google = require('google');
var assert = require('assert');

var ui = require('./ui');
var utils = require('./utils');
var log = require('./log');

var options = { version: 2.2 };
var context = new stackexchange(options);

function selectedGoogleItemCallback(links, callback) {
    return function(index) {
        if(links.length === 0) {
            log.error('Sorry, I cannot find any reasonable answer for your query.');
            process.exit(1);
        }
        var selectedLink = links[index];
        var parsedLink = utils.parseStackoverflowQuestionId(selectedLink.link)
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
            log.error("Cannot fetch answers from Stackoverflow.");
            log.error(err);
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
        callback(answers);

    }, [parsedLink.questionId]);
}

function googleError(err, links) {
    ui.stop();
    var msg = err.toString()

    if(msg.indexOf('have detected unusual traffic') !== -1) {
        log.error(
            "You are doing too many requests to Google. " +
            "You need to wait a bit before trying again.");
    }
    else if(msg.indexOf('ENOTFOUND') !== -1) {
        log.error("Cannot connect to Google. Make sure you are connected.");
        log.error(err);
    }
    else {
        log.error("Cannot connect to Google.");
        log.error(err);
    }
    process.exit(1);
}

function searchGoogle(text, lang, callback) {
    google.resultsPerPage = 40;
    var nextCounter = 0;

    var site;
    if(lang) {
        site = 'site:stackoverflow.com ' + lang;
    }
    else {
        site = 'site:unix.stackexchange.com';
    }
    var searchQuery = site + ' ' + text;

    google(searchQuery, function (err, next, links){
        if(err) {
            return googleError(err, links);
        }

        links = links.filter(function(link) {
            return link.title !== '';
        })
        .filter(utils.isValidGoogleLink);

        var strippedTitles = links.map(function(link) {
            // console.log(links[i].title + ' - ' + links[i].link) // link.href is an alias for link.link
            // console.log(links[i].description + "\n")
            var title = utils.stripStackOverflow(link.title);
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

function main(text, lang, remember) {
    ui.start();
    ui.showGoogling();

    function afterSearch(links, titles){
        ui.showGoogleList(titles, selectedGoogleItemCallback(links, function(answers) {
            ui.showAnswers(answers, function(index) {
                var selected = answers[index];
                ui.showAnswer(selected);
            });
        }));
    }

    if(!remember) {
        search(text, lang, afterSearch);
    }
    else {
        afterSearch(remember.links, remember.titles);
    }
}

function magic(text, lang) {
    var scanf = require('scanf');
    var colors = require('colors/safe');

    function scanfIndex() {
        var input;
        input = scanf('%d');
        return input;
    }

    function selectedAnswer(titles, answers, index, remember) {
        var markdown;
        var title;
        
        if (typeof answers === 'object' && typeof answers[index] !== 'undefined') {
            markdown = utils.toEscapedMarkdown(answers[index].body_markdown);
        } else {
            console.log('No answers found.');
            return;
        }

        if (typeof titles === 'object' && typeof titles[index] !== 'undefined') {
            title = titles[index];
        } else {
            title = 'Untitled answer';
        }
        
        console.log(colors.underline.green(title+'\n'));
        // console.log(colors.blue(Array(title.length).join('=')));
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

        console.log('Press SPACE for more choices, any other key to quit.');
        require('keypress')(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', onKeypress);

        function onKeypress(ch, key) {
            if(key) {
                if(key.name === 'space') {
                    process.stdin.removeListener('keypress', onKeypress);
                    return main(text, lang, remember);
                }
                else {
                    process.exit(0);
                }
            }
        }
    }

    search(text, lang, function(links, titles) {
        var selectItem = selectedGoogleItemCallback(links, function(answers){
            var remember = { links: links, titles: titles };
            selectedAnswer(titles, answers, 0, remember);
        });
        selectItem(0);
    });
}

module.exports = {
    main: main,
    magic: magic
};
