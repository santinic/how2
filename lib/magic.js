var scanf = require('scanf');
var ui = require('./ui');

function magic(text, lang) {
    search(text, lang, function(links, titles) {
        var selectItem = selectedGoogleItemCallback(links, function(answers){
            // console.log(answers)
            var markdown = ui.toEscapedMarkdown(answers[0].body_markdown);
            console.log(markdown);

            console.log('Alternative answers:');
            titles = titles.slice(0, 10).map(function(title, i) {
                return title;
            });
            console.log(titles);
            scanf('%d');
            // ui.magicSelect(titles);
        });
        selectItem(0);
     });
}

module.exports = {
    magic: magic
};
