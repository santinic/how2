var argv = require('yargs')
    .boolean('i')
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

if(argv.i) {
    howto.main(text, lang);
}
else {
    howto.magic(text, lang);
}
