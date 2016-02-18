/*tags expect*/

var stackexchange = require('../lib/stackexchange');

describe('Tags', function () {
  'use strict';

  var options, context, filter;

  beforeEach(function() {
    options = { version: 2.2 };
    context = new stackexchange(options);
    filter = {
      pagesize: 10,
      sort: 'popular',
      order: 'desc'
    };
  });

  function expectTagProperty(item) {
    expect(item).to.have.property('has_synonyms');
    expect(item).to.have.property('is_moderator_only');
    expect(item).to.have.property('is_required');
    expect(item).to.have.property('count');
    expect(item).to.have.property('name');
  }
  function expectSynonymsProperty(item) {
    expect(item).to.have.property('creation_date');
    expect(item).to.have.property('applied_count');
    expect(item).to.have.property('to_tag');
    expect(item).to.have.property('from_tag');
  }

  it('get tags', function(done) {
    context.tags.tags(filter, function(err, results){
      if (err) throw err;
      // console.log('results: ', results);

      expect(results.items).to.have.length(10);
      expectTagProperty(results.items[0]);
      expect(results.has_more).to.be.true;
      done();
    });
  });
  it('get tags illegal sort option', function(done) {
    filter.sort = 'creation';
    context.tags.tags(filter, function(err, results){
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

  it('get tags info', function(done) {
    var tags = ['javascript', 'ruby'];
    context.tags.info(filter, function(err, results){
      if (err) throw err;
      // console.log('results: ', results);

      expect(results.items).to.have.length(2);
      expectTagProperty(results.items[0]);
      expect(results.has_more).to.be.false;
      done();
    }, tags);
  });

  it('get tags info has error with empty tags', function(done) {
    context.tags.info(filter, function(err, results){
      expect(err).to.be.instanceof(Error);
      done();
    }, []);
  });

  it('get tags moderatorOnly return empty', function(done) {
    context.tags.moderatorOnly(filter, function(err, results){
      if (err) throw err;
      // console.log('results: ', results);

      expect(results.items).to.have.length(0);
      expect(results.has_more).to.be.false;
      done();
    });
  });

  it('get tags required return empty', function(done) {
    context.tags.required(filter, function(err, results){
      if (err) throw err;
      // console.log('results: ', results);

      expect(results.items).to.have.length(0);
      expect(results.has_more).to.be.false;
      done();
    });
  });

  it('get tags synonyms', function(done) {
    filter.sort = 'creation';
    context.tags.synonyms(filter, function(err, results){
      if (err) throw err;
      // console.log('results: ', results);

      expect(results.items).to.have.length(10);
      expectSynonymsProperty(results.items[0]);
      expect(results.has_more).to.be.true;
      done();
    });
  });
  it('get tags synonyms illegal sort option', function(done) {
    context.tags.synonyms(filter, function(err, results){
      expect(err).to.be.instanceof(Error);
      done();
    });
  });

  it('get tags faq', function(done) {
    context.tags.faq(filter, function(err, results) {
      if (err) throw err;
      // console.log('results: ', results);

      expect(results.items).to.have.length(10);
      expect(results.has_more).to.be.true;
      done();
    }, ['java', 'c']);
  });

  it('get tags related', function(done) {
    context.tags.related(filter, function(err, results) {
      if (err) throw err;
      // console.log('results: ', results);

      expect(results.items).to.have.length(10);
      expectTagProperty(results.items[0]);
      expect(results.has_more).to.be.true;
      done();
    }, ['java', 'javascript']);
  });

  it('get tags tagsSynonyms', function(done) {
    filter.sort = 'creation';
    context.tags.tagsSynonyms(filter, function(err, results) {
      if (err) throw err;
      // console.log('results: ', results);

      // expect(results.items).to.have.length(10);
      expectSynonymsProperty(results.items[0]);
      // expect(results.has_more).to.be.true;
      done();
    }, ['javascript']);
  });

  it('get tags topAnswerers', function(done) {
    context.tags.topAnswerers(filter, function(err, results) {
      if (err) throw err;
      // console.log('results: ', results);

      expect(results.items).to.have.length(10);
      expect(results.has_more).to.be.true;
      done();
    }, ['javascript'], 'all_time');
  });

  it('get tags topAnswerers illegal period', function(done) {
    context.tags.topAnswerers(filter, function(err, results) {
      expect(err).to.be.instanceof(Error);
      done();
    }, ['javascript'], 'all_days');
  });

  it('get tags topAskers', function(done) {
    context.tags.topAskers(filter, function(err, results) {
      if (err) throw err;
      // console.log('results: ', results);

      expect(results.items).to.have.length(10);
      expect(results.has_more).to.be.true;
      done();
    }, ['javascript']);
  });

  it('get tags topAskers illegal period', function(done) {
    context.tags.topAskers(filter, function(err, results) {
      expect(err).to.be.instanceof(Error);
      done();
    }, ['javascript'], 'all_days');
  });

  it('get tags wiki', function(done) {
    context.tags.wiki(filter, function(err, results) {
      if (err) throw err;
      console.log('results: ', results);

      expect(results.items).to.have.length(1);
      expect(results.items[0]).to.have.property('excerpt_last_edit_date');
      expect(results.items[0]).to.have.property('body_last_edit_date');
      expect(results.items[0]).to.have.property('excerpt');
      expect(results.items[0]).to.have.property('tag_name');
      expect(results.has_more).to.be.false;
      done();
    }, ['javascript']);
  });

});
