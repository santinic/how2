const google = require('google'),
    utils = require('./utils');

async function googleSearch(searchQuery) {
    google.resultsPerPage = 40;

    return new Promise((resolve, reject) => {
        google(searchQuery, (err, _, links) => {
            if (err) {
                return reject(err);
            }

            links = links.filter((link) => link.title !== '').filter(utils.isValidGoogleLink);
            let strippedTitles = links.map((link) => utils.stripStackOverflow(link.title));
            return resolve({links: links, titles: strippedTitles})
        });
    });
}

module.exports = googleSearch;