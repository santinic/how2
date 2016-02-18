# Stackexchange API for Node.js

Implementation of all stackexchange methods to query questions and awesome
answers.

Installation
----

```
npm install stackexchange --save
```

Usage
----

```js
var stackexchange = require('stackexchange');

var options = { version: 2.2 };
var context = new stackexchange(options);

var filter = {
  key: 'YOUR_API_KEY',
  pagesize: 50,
  tagged: 'node.js',
  sort: 'activity',
  order: 'asc'
};

// Get all the questions (http://api.stackexchange.com/docs/questions)
context.questions.questions(filter, function(err, results){
  if (err) throw err;
  
  console.log(results.items);
  console.log(results.has_more);
});

```
