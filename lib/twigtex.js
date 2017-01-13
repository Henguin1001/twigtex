var async = require('async'),
  fs = require('fs'),
  twig = require('twig'),
  extend = require('./extension.js'),
  tools = require('./tools.js');

// In order for async functions to be used the program renders once to
// become aware of the requests needed, It loads those requests and places them
// as plain text in the documention when rendered the second time
function compileFile(filein, globals, cb){
  async.waterfall([
      function renderTwigOnce(next){
        twig.renderFile(filein, {__:globals}, function(err) {
          next(err);
        });
      }, function loadRequests(next){
        extend.loadRequests(function(err, data){
          next(err, data);
        });
      }, function renderFileTwice(data, next){
          globals.cache = data;
          twig.renderFile(filein, {__:globals}, function(err, res){
            extend.clearRequests();
            next(err, res);
          });
      }
    ], cb);
}
function compileFiles(files, globals, cb){
  async.mapSeries(files, function(file, next){
    compileFile(file, globals, next);
  }, cb);
}
module.exports = function(file, cb, options){
  if(Array.isArray(file)){
    compileFiles(file, options.globals||{}, cb);
  } else {
    compileFile(file, options.globals||{}, cb);
  }
};
