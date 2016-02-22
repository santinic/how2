var _ = require('lodash');
var blessed = require('blessed');
var htmlentities = require('ent');

var utils = require('./utils');
var updates = require('./updates');

var screen;
var googleList;
var answersList;

function exit() {
    screen.destroy();
    var msg = updates.getResult();
    if(msg) {
        console.error(msg);
    }
    process.exit(0);
}

function start() {
    updates.checkForUpdates();

    screen = blessed.screen({
        smartCSR: true,
        autoPadding: true
    });

    screen.title = 'how2';

    screen.key(['C-c'], function(ch, key) {
        exit();
    });
}

function listStyle() {
    return {
        selectedBg: 'blue',
        selectedFg: 'white',
        mouse: true,
        keys: true,
        vi: true
    };
}

function showGoogling() {
    var box = blessed.box({
        content: 'Googling...'
    });
    screen.append(box);
    screen.render();
}

function showGoogleList(items, callback) {
    var options = {
        parent: screen,
        //   cols: 20,
        //   rows: 20,
        width: '100%',
        height: '100%',
        top: 'center',
        left: 'center',
        padding: 1,
        title: 'Select Answer:',
        mouse: true
    }
    _.extend(options, listStyle());
    googleList = blessed.list(options);

    googleList.setItems(items);

    googleList.prepend(new blessed.Text({
        // left: 2,
        content: 'Select one code tip:'
    }));

    googleList.on('select', function(event) {
        callback(this.selected);
    });

    googleList.key(['escape', 'q'], function() {
        exit();
    });

    googleList.select(0);
    googleList.focus();
    screen.render();
}

function makeTitleForAnswer(answer) {
    var withColors = utils.marked(answer.body_markdown);

    var lines = withColors.split('\n');

    var firstLine;
    for(var i=0; i < lines.length; i++) {
        firstLine = lines[i]
        if(firstLine !== '') break;
    }
    firstLine = htmlentities.decode(firstLine);
    var score = '('+answer.score+') ';
    return score + firstLine;
}

function showAnswers(answers, callback) {
    var listBox = blessed.box({
        top: 'center',
        left: 'center',
        width: '90%',
        height: '90%',
        border: {
            type: 'line',
        },
        tags: true,
    });

    var listOptions = {
        parent: listBox,
        border: {
            type: 'bg',
        },
    };
    _.extend(listOptions, listStyle());
    answersList = blessed.list(listOptions);

    answersList.setItems(answers.map(makeTitleForAnswer));

    answersList.on('select', function() {
        callback(this.selected);
    });

    answersList.key(['escape', 'q'], function() {
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
            type: 'line',
        },
        padding : 1,
        scrollable: true,
        alwaysScroll: true,
        scrollbar: {
            border: {
                bg: 'yellow'
            },
            bg: 'yellow'
        },
        keys: true,
        mouse: true
    });

    answerBox.setContent(text);

    answerBox.key(['escape', 'q'], function() {
        screen.remove(answerBox);
        answersList.focus();
        screen.render();
    });

    screen.append(answerBox);
    answerBox.focus();
    screen.render();
}

function magicSelect(rows) {
    screen = blessed.screen({
        autoPadding: true
    });
    var list = blessed.list({
    });
    list.setItems(rows)
    screen.append(list);
    screen.render();
}

module.exports = {
    start: start,
    stop: function() {
        if(screen) {
            screen.destroy();
        }
    },
    showGoogling: showGoogling,
    showGoogleList: showGoogleList,
    showAnswers: showAnswers,
    showAnswer: showAnswer,
    magicSelect: magicSelect
};
