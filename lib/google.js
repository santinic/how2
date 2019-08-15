const utils = require('./utils'),
  googleIt = require('@vlado521/google-it');

async function googleSearch(searchQuery) {
  const query = searchQuery.split(' ')[1];
  const isQueryEmpty = utils.isStringEmpty(query);

  if (isQueryEmpty) {
    return { links: [], titles: [] };
  }

  return new Promise((resolve, reject) => {
    googleIt({ query: searchQuery }).then(res => {
      const links = res.map(el => el.link);
      const titles = res.map(el => utils.stripStackOverflow(el.title));

      return resolve({ links, titles });
    });
  });
}

module.exports = googleSearch;
