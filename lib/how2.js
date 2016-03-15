var _ = require('lodash');
var stackexchange = require('./stackexchange/lib/stackexchange');
var google = require('google');
var assert = require('assert');
var spinner = require('simple-spinner');
var spinnerOptions = { doNotBlock: true };

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
        var parsedLink = utils.parseStackoverflowQuestionId(selectedLink.link);
        fetchQuestionAnswers(parsedLink, callback);
    };
}

function fetchQuestionAnswers(parsedLink, callback) {
    assert(parsedLink);
    var questionCriteria = {
        filter: '!-*f(6s6U8Q9b'  // body_markdown and link
    };
    questionCriteria.site = parsedLink.site;
    context.questions.answers(questionCriteria, function(err, results){
        if(err) {
            ui.stop();
            log.error('Cannot fetch answers from Stackoverflow.');
            log.error(err);
            process.exit(1);
        }
        if(results.error_id) {
            ui.stop();
            console.error(results);
            process.exit(1);
        }

        var answers = _.sortBy(results.items, function(answer) {
            return - answer.score;
        });

        callback(answers);

    }, [parsedLink.questionId]);
}

function googleError(err, links) {
    ui.stop();
    var msg = err.toString();

    if(msg.indexOf('have detected unusual traffic') !== -1) {
        log.error(
            'You are doing too many requests to Google. ' +
            'You need to wait a bit before trying again.');
    }
    else if(msg.indexOf('ENOTFOUND') !== -1) {
        log.error('Cannot connect to Google. Make sure you are connected.');
        log.error(err);
    }
    else {
        log.error('Cannot connect to Google.');
        log.error(err);
    }
    process.exit(1);
}

function searchGoogle(text, lang, callback) {
    google.resultsPerPage = 40;

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
            var title = utils.stripStackOverflow(link.title);
            return title;
        });

        callback(links, strippedTitles);

    });
}

function search(text, lang, callback) {
    return searchGoogle(text, lang, callback);
}

function main(text, lang, remember) {
    ui.start();
    spinner.start(spinnerOptions);

    function afterSearch(links, titles){
        spinner.stop();
        ui.showGoogleList(links, titles, selectedGoogleItemCallback(links, function(answers) {
            ui.showAnswers(answers, function(index) {
                var selected = answers[index];
                if (selected) {
                    ui.showAnswer(selected);
                }
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
    var colors = require('colors/safe');

    function selectedAnswer(titles, answers, index, remember) {
        if(answers.length === 0) {
            log.error('Cannot find any reasonable answer for your query.');
            if(!lang) {
                console.log('To get the best answers, make sure you specify the language with '+ colors.blue('-l:'));
                console.log('example: $ how2 '+colors.blue('-l python') +' permutations list');
                console.log('example: $ how2 '+colors.blue('-l ruby') + ' permutations list');
            }
            process.exit(1);
        }

        var markdown = utils.toEscapedMarkdown(answers[index].body_markdown);

        var title = titles[index];
        console.log(colors.underline.green(title+'\n'));
        console.log(markdown);

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
            spinner.stop();
            var remember = { links: links, titles: titles };
            selectedAnswer(titles, answers, 0, remember);
        });
        selectItem(0);
    });
    spinner.start(spinnerOptions);
}

module.exports = {
    main: main,
    search: search,
    magic: magic
};
