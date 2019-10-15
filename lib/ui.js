var _ = require('lodash');
var blessed = require('blessed');
var htmlentities = require('ent');
var colors = require('colors');

var utils = require('./utils');
var updates = require('./updates');

var screen;
var googleList;
var answersList;
var logBox;

function exit() {
    screen.destroy();
    var msg = updates.getResult();
    if (msg) {
        console.error(msg);
    }
    process.exit(0);
}

function start() {
    updates.checkForUpdates();

    screen = blessed.screen({smartCSR: true, autoPadding: true});

    screen.key(['C-c'], function (ch, key) {
        exit();
    });

    var logText = colors
        .bgBlue
        .white
        .bold(' Enter/Space ') + ' open link ' + colors
        .bgBlue
        .white
        .bold(' b ') + ' open browser ' + colors
        .bgBlue
        .white
        .bold(' Esc ') + ' close window';
    logBox = blessed.box({width: '100%', top: '100%-1', content: logText});
    screen.append(logBox);
    screen.render();
}

function listStyle() {
    return {
        selectedBg: '#b2dfdb', selectedFg: 'black',
        mouse: true,
        keys: true,
        vi: true
    };
}

function showGoogling() {
    var box = blessed.box({content: 'Googling...'});
    screen.append(box);
    screen.render();
}

function showGoogleList(searchResults, callback) {
    const titles = searchResults.map(el => el.title)
    var options = {
        parent: screen,
        width: '100%',
        height: '100%-1',
        top: 'center',
        left: 'center',
        padding: 1,
        title: 'Select Answer:',
        // mouse: true
    };
    _.extend(options, listStyle());
    googleList = blessed.list(options);

    googleList.setItems(titles);

    googleList.prepend(new blessed.Text({content: 'Select one code tip:'}));

    googleList.on('select', function (_) {
        callback(this.selected);
    });

    googleList.key([
        'space', 'o'
    ], function () {
        googleList.enterSelected();
        screen.render();
    });

    googleList.key([
        'escape', 'q'
    ], function () {
        exit();
    });

    googleList.key(['b'], function () {
        var link = searchResults[this.selected].link;
        try {
            require('openurl').open(link);
        } catch (e) {}
    });

    googleList.select(0);
    googleList.focus();
    screen.render();
}

function makeTitleForAnswer(answer) {
    var withColors = utils.kbdTagFix(utils.marked(answer.body_markdown));

    var lines = withColors.split('\n');

    var firstLine;
    for (var i = 0; i < lines.length; i++) {
        firstLine = lines[i];
        if (firstLine !== '') 
            break;
        }
    firstLine = htmlentities.decode(firstLine);
    var score = '(' + answer.score + ') ';
    return score + firstLine;
}

function showAnswers(answers, callback) {
    var listBox = blessed.box({
        top: 'center',
        left: 'center',
        width: '90%',
        height: '90%',
        border: {
            type: 'line'
        },
        tags: true
    });

    var listOptions = {
        parent: listBox,
        border: {
            type: 'bg'
        }
    };
    _.extend(listOptions, listStyle());
    answersList = blessed.list(listOptions);

    answersList.setItems(answers.map(makeTitleForAnswer));

    answersList.on('select', function () {
        callback(this.selected);
    });

    answersList.key([
        'space', 'o'
    ], function () {
        answersList.enterSelected();
        screen.render();
    });

    answersList.key(['b'], function() {
        var answer = answers[this.selected];
        require('openurl').open(answer.link);
    });

    answersList.key([
        'escape', 'q'
    ],  () => {
        screen.remove(listBox);
        googleList.focus();
        screen.render();
    });

    listBox.append(answersList);
    answersList.focus();
    screen.append(listBox);
    screen.render();
}

function showAnswer(answer) {
    var text = utils.toEscapedMarkdown(answer.body_markdown);

    var answerBox = blessed.box({
        top: 'center',
        left: 'center',
        width: '80%',
        height: '80%',
        border: {
            type: 'line'
        },
        padding: 1,
        scrollable: true,
        alwaysScroll: true,
        scrollbar: {
            border: {
                bg: 'yellow'
            },
            bg: 'yellow'
        },
        keys: true,
        vi: true,
        // mouse: true
    });

    answerBox.setContent(text + '\n(' + colors.underline.blue(answer.link) + ')');

    answerBox.key([
        'escape', 'q'
    ], function () {
        screen.remove(answerBox);
        answersList.focus();
        screen.render();
    });

    answerBox.key(['b'], function(event) {
        require('openurl').open(answer.link);
    });

    screen.append(answerBox);
    answerBox.focus();
    screen.render();
}

function magicSelect(rows) {
    screen = blessed.screen({autoPadding: true});
    var list = blessed.list({});
    list.setItems(rows);
    screen.append(list);
    screen.render();
}

module.exports = {
    start: start,
    stop: () => screen ? screen.destroy() : undefined,
    showGoogling: showGoogling,
    showGoogleList: showGoogleList,
    showAnswers: showAnswers,
    showAnswer: showAnswer,
    magicSelect: magicSelect
};
