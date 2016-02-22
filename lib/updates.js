
var checkResult = null;

function checkForUpdates() {
    var npmLatest = require('npm-latest');
    var package = require('../package.json');
    var fs = require('fs');
    var colors = require('colors');

    function later(a, b) {
        var as = a.split('.');
        var bs = b.split('.');
        for(var i=0; i<3; i++) {
            if(as[i] > bs[i])
                return true;
        }
        return false;
    }

    npmLatest('how2', { timeout: 1500 }, function (err, npm) {
        if(err) {
            console.error(err);
            return;
        }
        if(later(npm.version, package.version)) {
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
