const _ = require('lodash'),
    stackexchange = require('./stackexchange/'),
    assert = require('assert'),
    spinner = require('simple-spinner'),
    colors = require('colors/safe');

const log = require('./log'),
    google = require('./google'),
    utils = require('./utils'),
    ui = require('./ui');

const STACKEXCHANGE_OPTIONS = {
        version: 2.2
    },
    SPINNER_OPTIONS = {
        doNotBlock: true
    };

var context = new stackexchange(STACKEXCHANGE_OPTIONS);

async function fetchQuestionAnswers(parsedLink) {
    assert(parsedLink);
    var questionCriteria = {
        filter: '!-*f(6s6U8Q9b' // body_markdown and link
    };
    questionCriteria.site = parsedLink.site;

    try {
        let results = await context.questions.answers(questionCriteria, [parsedLink.questionId]);
        var answers = _.sortBy(results.items, (answer) => -answer.score);
        return answers;
    } catch (err) {
        ui.stop();
        log.error('Cannot fetch answers from Stackoverflow.');
        log.error(err);
    }
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

function googleSearch(text, lang) {
    const site = lang
        ? `site:stackoverflow.com ${lang}`
        : `site:unix.stackexchange.com`;

    return google(`${site} ${text}`)
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

async function onAfterSearch(text, links, titles, lang, index) {
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
    try {
        let answers = await fetchQuestionAnswers(parsedLink);
        selectAnswer({
            text,
            titles,
            answers,
            lang,
            index,
            remember
        });
    } catch (err) {
        log.error(err);
        process.exit(1);
    }
}

function onAfterInteractiveSearch(links, titles) {
    spinner.stop();

    if (links.length === 0) {
        log.error('Sorry, I cannot find any reasonable answer for your query.');
        process.exit(1);
    }
    ui.showGoogleList(links, titles, async(index) => {
        var selectedLink = links[index];
        var parsedLink = utils.parseStackoverflowQuestionId(selectedLink.link);
        try {
            let answers = await fetchQuestionAnswers(parsedLink);
            showAnswers(answers)
        } catch (err) {
            onErrorSearch(err)
        }
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

async function main(text, lang) {
    spinner.start(SPINNER_OPTIONS);
    try {
        let {links, titles} = await googleSearch(text, lang)
        onAfterSearch(text, links, titles, lang, 0);
    } catch (err) {
        onErrorSearch(err);
    }
}

async function interactiveMain(text, lang, remember) {
    ui.start();
    spinner.start(SPINNER_OPTIONS);

    if (!remember) {
        try {
            let {links, titles} = await googleSearch(text, lang)
            onAfterInteractiveSearch(links, titles);
        } catch (err) {
            onErrorSearch(err)
        }
    } else {
        onAfterInteractiveSearch(remember.links, remember.titles)
    }
}

module.exports = {
    main: main,
    googleSearch: googleSearch,
    interactiveMain: interactiveMain
};