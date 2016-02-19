var argv = require('yargs')
    .boolean('m')
    .argv;

function help() {
    console.log(
        '$ howto tar compress file \n' +
        '$ howto -l python sort array  \n\n' +
        'Get the first result: \n' +
        '$ howto -m concatenate two files\n'
    );
    process.exit(0);
}

if(argv._.length === 0) {
    help();
}

var text = argv._.join(' ');
var lang = argv.l;
var howto = require('./how2');

if(argv.m) {
    howto.magic(text, lang);
}
else {
    howto.main(text, lang);
}
