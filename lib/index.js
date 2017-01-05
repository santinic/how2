var _ = require('lodash');
var colors = require('colors');
var package = require('../package');
var argv = require('yargs')
    .boolean('i')
    .boolean('h')
    .alias('h', 'help')
    .argv;

function help() {
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

var text = _.join(argv._, ' ');

function checkTextContainsLang(text) {
    var lower = _.toLower(text);
    var langs = ['python', 'javascript', 'ruby', 'perl', 'php', 'c++', 'zsh'];
    _.forEach(langs, function(lang) {
        if(_.includes(lower, lang)) {
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
