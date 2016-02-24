var assert = require('chai').assert;
var fun = require('../lib/utils').stripStackOverflow;

describe('stripStackOverflow', function() {
    it('should not strip -f parameters in the title', function () {
        var title = 'monitoring - How does the "tail" command\'s "-f" parameter ...';
        assert.equal(fun(title), title);
    });
    it('should strip Unix & Linux Stack Exchange', function() {
        assert.equal(
            fun('table - combine text files column-wise - Unix & Linux Stack Exchange'),
            'table - combine text files column-wise'
        );
    });
    it('should strip Unix', function() {
        assert.equal(
            fun('table - combine text files column-wise - Unix ...'),
            'table - combine text files column-wise'
        );
    });
    it('should preserve titles with one dash on the left', function() {
        assert.equal(
            fun('table - combine text files columnwise'),
            'table - combine text files columnwise'
        );
    });
    it('should strip titles with one dash on the right', function() {
        assert.equal(
            fun('How to merge all (text) files in a directory into one? - Unix & Linux'),
            'How to merge all (text) files in a directory into one?'
        );
    });
});
