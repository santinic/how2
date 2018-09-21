var _ = require('lodash');
var stackexchange = require('./stackexchange/lib/stackexchange');
var google = require('google');
var assert = require('assert');
var spinner = require('simple-spinner');
var spinnerOptions = {
    doNotBlock: true
};

var colors = require('colors/safe');
var ui = require('./ui');
var utils = require('./utils');
var log = require('./log');

var options = {
    version: 2.2
};
var context = new stackexchange(options);

function fetchQuestionAnswers(parsedLink) {
    assert(parsedLink);
    var questionCriteria = {
        filter: '!-*f(6s6U8Q9b' // body_markdown and link
    };
    questionCriteria.site = parsedLink.site;
    return new Promise((resolve, reject) => {
        context
            .questions
            .answers(questionCriteria, (err, results) => {
                if (err) {
                    ui.stop();
                    log.error('Cannot fetch answers from Stackoverflow.');
                    reject(err)
                }
                if (results.error_id) {
                    ui.stop();
                    reject(results);
                }

                var answers = _.sortBy(results.items, (answer) => -answer.score);
                return resolve(answers);
            }, [parsedLink.questionId]);
    });
}

function onErrorSearch(err) {
    ui.stop();
    var msg = err.toString();

    if (msg.indexOf('have detected unusual traffic') !== -1) {
        log.error('You are doing too many requests to Google. You need to wait a bit before trying ' +
                'again.');
    } else if (msg.indexOf('ENOTFOUND') !== -1) {
        log.error('Cannot connect to Google. Make sure you are connected.');
        log.error(err);
    } else {
        log.error('Cannot connect to Google.');
        log.error(err);
        log.error(err.stack);
    }
    process.exit(1);
}

function searchGoogle(text, lang) {
    google.resultsPerPage = 40;

    const site = lang
            ? `site:stackoverflow.com ${lang}`
            : `site:unix.stackexchange.com`,
        searchQuery = `${site} ${text}`;

    return new Promise((resolve, reject) => {
        google(searchQuery, (err, _, links) => {
            if (err) {
                return reject(err);
            }

            links = links.filter((link) => link.title !== '').filter(utils.isValidGoogleLink);

            var strippedTitles = links.map((link) => {
                var title = utils.stripStackOverflow(link.title);
                return title;
            });

            return resolve({links: links, titles: strippedTitles})
        });
    });
}

function search(text, lang) {
    return searchGoogle(text, lang);
}

function selectAnswer({
    text,
    titles,
    answers,
    lang,
    index,
    remember
}) {
    spinner.stop();
    if (answers.length === 0) {
        log.error('Cannot find any reasonable answer for your query.');
        if (!lang) {
            console.log(`To get the best answers, make sure you specify the language with ${colors.blue('-l:')}`);
            console.log(`example: $ how2 ${colors.blue('-l python')} permutations list`);
            console.log(`example: $ how2 ${colors.blue('-l ruby')} permutations list`);
        }
        process.exit(1);
    }

    const markdown = utils.toEscapedMarkdown(answers[index].body_markdown),
        title = titles[index];

    console.log(colors.underline.green(`${title}\n`));
    console.log(markdown);

    console.log('Press SPACE for more choices, any other key to quit.');
    require('keypress')(process.stdin);
    process
        .stdin
        .setRawMode(true);
    process
        .stdin
        .on('keypress', onKeypress);

    function onKeypress(_, key) {
        if (key) {
            if (key.name === 'space') {
                process
                    .stdin
                    .removeListener('keypress', onKeypress);
                return interactiveMain(text, lang, remember);
            } else {
                process.exit(0);
            }
        }
    }
}

function onAfterSearch(text, links, titles, lang, index) {
    if (links.length === 0) {
        log.error('Sorry, I cannot find any reasonable answer for your query.');
        process.exit(1);
    }

    const selectedLink = links[index],
        parsedLink = utils.parseStackoverflowQuestionId(selectedLink.link),
        remember = {
            links: links,
            titles: titles
        };

    fetchQuestionAnswers(parsedLink).then((answers) => selectAnswer({
        text,
        titles,
        answers,
        lang,
        index,
        remember
    })).catch((err) => {
        log.error(err);
        process.exit(1);
    });
}

function onAfterInteractiveSearch(text, links, titles, lang) {
    spinner.stop();

    ui.showGoogleList(links, titles, (index) => {
        if (links.length === 0) {
            log.error('Sorry, I cannot find any reasonable answer for your query.');
            process.exit(1);
        }
        var selectedLink = links[index];
        var parsedLink = utils.parseStackoverflowQuestionId(selectedLink.link);
        fetchQuestionAnswers(parsedLink).then(showAnswers);
    });
}

function showAnswers(answers) {
    ui.showAnswers(answers, (index) => {
        var selected = answers[index];
        if (selected) {
            ui.showAnswer(selected);
        }
    })
}

function main(text, lang) {
    search(text, lang).then(({links, titles}) => onAfterSearch(text, links, titles, lang, 0)).catch(onErrorSearch);
    spinner.start(spinnerOptions);
}

function interactiveMain(text, lang, remember) {
    ui.start();
    spinner.start(spinnerOptions);

    if (!remember) {
        search(text, lang).then(({links, titles}) => onAfterInteractiveSearch(text, links, titles, lang)).catch(onErrorSearch);
    } else {
        onAfterInteractiveSearch(text, remember.links, remember.titles, lang)
    }
}

module.exports = {
    main: main,
    search: search,
    interactiveMain: interactiveMain
};