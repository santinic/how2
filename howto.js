var stackexchange = require('stackexchange');
var _ = require('lodash');
var ui = require('./ui');
var google = require('google')

var options = { version: 2.2 };
var context = new stackexchange(options);

function search(query) {
    var filter = {
        site: 'stackoverflow',
        // key: 'YOUR_API_KEY',
        title: query,
        // pagesize: 50,
        tagged: 'bash;shell;unix;linux',
        sort: 'votes',
        order: 'desc',
    };

    context.search.advanced(filter, function(err, results){
        if (err) throw err;

        var items = results.items;

        var items = _.sortBy(results.items, function(item) {
            return - parseInt(item.score);
        });

        var uiList = items.map(function(item) {
            return item.title + ' ' + item.score;
        });
        console.log(uiList)
        ui.start();
        ui.showList(items);
    });
}

function stripStackOverflow(title) {
    var i = title.indexOf(' - Stack Overflow');
    if(i === -1) return title;
    return title.substring(0, i);
}

function parseQuestionId(link) {
    var prefix = 'http://stackoverflow.com/questions/';
    var i = link.indexOf(prefix);
    if(i === -1) throw 'Invalid stackoverflow link: ' + link;
    return link.substring(prefix.length, link.length);
}

function selectedGoogleItemCallback(links) {
    return function(index) {
        var selectedLink = links[index];
        ui.destroy();
        console.log(selectedLink)
        var questionId = parseQuestionId(selectedLink.link)

        fetchQuestionAnswers(questionId);
    };
}

function fetchQuestionAnswers(questionId) {
    var questionCriteria = {
        filter: '!9YdnSM68f' // body_markdown
        // site: 'unix'
    };
    context.questions.answers(questionCriteria, function(err, results){
        if(err) throw err;

        console.log(results);



        // var answerIds = results.items.map(function(answer) {
        //     return answer.answer_id;
        // });
        //
        // var answerCriteria = {
        //     filter: '!bJjknb-2oi7wPP' // body and body_markdown
        //     // filter: '!bJjknb-2oi7wT6' // body_markdown
        // };
        // context.answers.answers(answerCriteria, function(err, results) {
        //     if(err) throw err;
        //
        //     var answer = results.items[0];
        //     console.log(answer.body_markdown);
        //
        //     ui.showAnswer(answer);
        //
        // }, answerIds);


    }, [questionId]);
}

function searchGoogle(keys) {
    google.resultsPerPage = 25
    var nextCounter = 0

    var searchQuery = "site:stackoverflow.com " + keys;

    google(searchQuery, function (err, next, links){
        if(err) console.error(err)

        var uiLinks = links.map(function(link) {
            // console.log(links[i].title + ' - ' + links[i].link) // link.href is an alias for link.link
            // console.log(links[i].description + "\n")

            var title = stripStackOverflow(link.title);

            return title //+ ': ' + link.description;
        })
        ui.start();
        ui.showList(uiLinks, selectedGoogleItemCallback(links));

        // if (nextCounter < 4) {
        // nextCounter += 1
        // if (next) next()
        // }
    })

}

function main() {
    var words = process.argv.slice(2)
    var text = words.join(' ');

    searchGoogle(text)
    // search(query);

    // fetchQuestionAnswers('35380999')
}

main();
