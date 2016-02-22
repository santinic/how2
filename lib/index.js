var argv = require('yargs')
    .boolean('i')
    .boolean('h')
    .alias('h', 'help')
    .argv;

function help() {
    var colors = require('colors');
    var package = require('../package');
    console.log(
        'how2 version '+package.version+' - by Claudio Santini\n'+
        'usage: how2 [-l python/ruby/etc.] search string\n\n' +
        '$ how2 '+ colors.yellow('read file while is changing\n') +
        '\n' +
        '$ how2 '+ colors.blue('-l python ') + colors.yellow('permutations of a list')+'\n'
    );
    process.exit(0);
}

if(argv._.length === 0 || argv.h) {
    help();
}

// Add support for 'how to' command
if (argv['$0'] === 'how') {
    argv._.splice(0, 1);
}

var text = argv._.join(' ');

function checkTextContainsLang(text) {
    var colors = require('colors');
    var lower = text.toLowerCase();
    var langs = ['python', 'javascript', 'ruby', 'perl', 'php', 'c++', 'zsh'];
    langs.forEach(function(lang) {
        if(lower.indexOf(lang) !== -1) {
            console.log(colors.red(
                'You should use the option '+colors.blue('-l')+' to specify the language.')
            );
            console.log('example: $ how2 '+colors.blue('-l '+lang)+' search text\n');
        }
    });
}

if(!argv.l){
    checkTextContainsLang(text);
}

var how2 = require('./how2');

if(argv.i) {
    how2.main(text, argv.l);
}
else {
    how2.magic(text, argv.l);
}
