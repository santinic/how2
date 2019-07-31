const utils = require("./utils"),
  axios = require("axios"),
  cheerio = require("cheerio"),
  querystring = require("querystring"),
  util = require("util");

const linkSel = "h3.r a",
  descSel = "div.s",
  itemSel = "div.jfp3ef";

const URL =
  "https://www.google.%s/search?hl=%s&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8&gws_rd=ssl";

async function googleSearch(searchQuery) {
  google.resultsPerPage = 40;

  return new Promise((resolve, reject) => {
    google(searchQuery, (err, _, links) => {
      console.log(`Query to google ${searchQuery}`);
      console.log(err, links);
      if (err) {
        return reject(err);
      }

      links = links
        .filter(link => link.title !== "")
        .filter(utils.isValidGoogleLink);
      let strippedTitles = links.map(link =>
        utils.stripStackOverflow(link.title)
      );
      return resolve({ links: links, titles: strippedTitles });
    });
  });
}

// start parameter is optional
function google(query, start, callback) {
  var startIndex = 0;
  if (typeof callback === "undefined") {
    callback = start;
  } else {
    startIndex = start;
  }
  igoogle(query, startIndex, callback);
}

google.resultsPerPage = 10;
google.tld = "com";
google.lang = "en";
google.requestOptions = {};
google.nextText = "Next";

async function igoogle(query, start, callback) {
  if (google.resultsPerPage > 100) google.resultsPerPage = 100; // Google won't allow greater than 100 anyway

  // timeframe is optional. splice in if set
  if (google.timeSpan) {
    URL =
      URL.indexOf("tbs=qdr:") >= 0
        ? URL.replace(/tbs=qdr:[snhdwmy]\d*/, "tbs=qdr:" + google.timeSpan)
        : URL.concat("&tbs=qdr:", google.timeSpan);
  }

  var newUrl = util.format(
    URL,
    google.tld,
    google.lang,
    querystring.escape(query),
    start,
    google.resultsPerPage
  );

  try {
    const resp = await axios.get(newUrl);
    const links = processResponse(resp);
    callback(links);
  } catch (err) {
    console.log(err);
    throw new Error(
      "Error on response" +
        (resp ? " (" + resp.statusCode + ")" : "") +
        ":" +
        err +
        " : " +
        resp.data
    );
  }
}

function processResponse(resp) {
  var $ = cheerio.load(resp.data);
  var links = [];

  $(itemSel).each((i, elem) => {
    console.log(elem.type);
    var linkElem = $(elem).find(linkSel);
    console.log(linkElem);
    var descElem = $(elem).find(descSel);
    var item = {
      title: $(linkElem)
        .first()
        .text(),
      link: null,
      description: null,
      href: null
    };
    var qsObj = querystring.parse($(linkElem).attr("href"));

    if (qsObj["/url?q"]) {
      item.link = qsObj["/url?q"];
      item.href = item.link;
    }

    $(descElem)
      .find("div")
      .remove();
    item.description = $(descElem).text();

    links.push(item);
  });

  return links;
}

module.exports = google;

module.exports = googleSearch;
