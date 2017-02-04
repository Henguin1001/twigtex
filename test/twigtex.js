var assert = require('assert'),
  rewire = require('rewire'),
  mock = require('mock-fs'),
  twigtex = require('../lib/twigtex.js');

// Setup testing file syctem
mock({
  'single':{
    'file.twig.tex': '{{str}}',
  },
  'multi': {
    'file1.twig.tex': '{{str}}',
    'file2.twig.tex': '{{str}}',
  },
  'complex':{
    'file1.twig.tex':'{% block head %}0{% endblock%}',
    'file2.twig.tex':'{% extends "file1.twig.tex" %}{% block head %}{{str}}{% endblock %}',
  }
});
after(function (done) {
  mock.restore();
  done();
});

describe('twigtex', function() {
  describe('#', function() {
    it('should compile a single file', function(done) {
      twigtex('single/file.twig.tex', function(err, res){
        assert.equal(res, "teststring");
        done(err);
      },{ globals:{
        str:"teststring"
      }});
    });
    it('should compile multiple files', function(done) {
      twigtex(['multi/file1.twig.tex', 'multi/file2.twig.tex'], function(err, res){
        assert.deepEqual(res, ["teststring", "teststring"]);
        done(err);
      },{ globals:{
        str:"teststring"
      }});
    });
    it('should compile imported file chain', function(done) {
      twigtex('complex/file2.twig.tex', function(err, res){
        assert.equal(res, 'teststring');
        done(err);
      },{ globals:{
        str:"teststring"
      }});
    });
    it('should throw and error when file doesnt exist', function(done) {
      twigtex('single/fake.twig.tex', function(err, res){
        assert(!!err);
        done();
      });
    });
  });
});
