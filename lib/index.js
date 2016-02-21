var argv = require('yargs')
    .boolean('i')
    .boolean('h')
    .alias('h', 'help')
    .argv;

function help() {
    var colors = require('colors');
    console.log(
        'how2 version 1.0 - (Copyleft) by Claudio Santini.\n\n' +
        '$ how2 '+ colors.yellow('read file while is changing \n') +
        '\n' +
        '$ how2 '+ colors.blue('-l python ') + colors.yellow('permutations of a ')+'\n'
    );
    process.exit(0);
}

if(argv._.length === 0 || argv.h) {
    help();
}

var text = argv._.join(' ');
var lang = argv.l;
var how2 = require('./how2');

if(argv.i) {
    how2.main(text, lang);
}
else {
    how2.magic(text, lang);
}
