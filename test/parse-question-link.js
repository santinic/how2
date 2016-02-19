var assert = require('assert');
var fun = require('../lib/utils').parseStackoverflowQuestionId;

describe('parseStackoverflowQuestionId', function() {
    it('should not recognize empty strings', function () {
        assert.equal(fun(''), null);
    });
    xit('should not recognize links that are not from stackexchange/overflow', function () {
        var url = 'http://someother.com/questions/2342/title';
        assert.equal(fun(url), null);
    });
    it('should parse stackoverflow links', function () {
        var url = 'http://stackoverflow.com/questions/39934/is-it-possible-to';
        assert.deepEqual(fun(url), {
            site: null,
            questionId: '39934'
        });
    });
    it('should parse unix.stackoverflow links', function () {
        var url = 'http://unix.stackexchange.com/questions/39934/is-it-possible-to';
        assert.deepEqual(fun(url), {
            site: 'unix',
            questionId: '39934'
        });
    });
});
