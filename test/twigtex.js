var assert = require('assert'),
  rewire = require('rewire'),
  mock = require('mock-fs'),
  twigtex = require('../lib/twigtex.js');

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
    'file2.twig.tex':'{% block head %}{{str}}{% endblock%}',
  }
});
after(function (done) {
  mock.restore();
});

describe('Twigtex', function() {
  describe('#()', function() {
    it('should compile a single file', function(done) {
      twigtex('single/file.twig.tex', function(err, res){
        assert.equal(res, "teststring");
        done(err);
      },{ globals:{
        str:"teststring"
      }});
    });
    it('should compile a multiple files', function(done) {
      twigtex(['single/file1.twig.tex', 'single/file2.twig.tex'], function(err, res){
        assert.equal(res, ["teststring", "teststring"]);
        done(err);
      },{ globals:{
        str:"teststring"
      }});
    });
  });
});
