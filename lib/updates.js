
var checkResult = null;

function checkForUpdates() {
    var npmLatest = require('npm-latest');
    var package = require('../package.json');
    var colors = require('colors');
    var semver = require('semver');

    npmLatest('how2', { timeout: 1500 }, function (err, npm) {
        if(err) {
            console.error(err);
            return;
        }
        if(semver.gt(npm.version, package.version)) {
            checkResult = colors.yellow(
                '\nA new version of how2 is available: '+npm.version+'\n'+
                'Run '+colors.blue('npm update -g how2')+' to update.\n'
            );
        }
    });
}

function getResult() {
    return checkResult;
}

module.exports = {
    checkForUpdates: checkForUpdates,
    getResult: getResult
};
