var argv = require('yargs')
    .boolean('i')
    .boolean('h')
    .alias('h', 'help')
    .argv;

function help() {
    var colors = require('colors');
    console.log(
        'how2 version 1.0 - (Copyleft) by Claudio Santini.\n\n' +
        '$ howto '+ colors.yellow('read file while is changing \n') +
        '\n' +
        '$ howto '+ colors.blue('-l python ') + colors.yellow('permutations of a ')+'\n'
    );
    process.exit(0);
}

if(argv._.length === 0 || argv.h) {
    help();
}

var text = argv._.join(' ');
var lang = argv.l;
var howto = require('./how2');

if(argv.i) {
    howto.main(text, lang);
}
else {
    howto.magic(text, lang);
}
