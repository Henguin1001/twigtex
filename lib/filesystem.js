var extend = require('./extension.js'),
  fs = require('fs'),
  path = require('path');
extend.extendFunction("json_parse", function(value) {
  return JSON.parse(value);
});
extend.extendFunction("extend", function(filename) {
  filename = path.resolve(filename);
  var extension = require(filename);
  return extension(extend)||"";
});
extend.extendFunctionAsync("readFile", function(filename, cb){
  fs.readFile(filename, 'UTF8', cb);
});
extend.extendFunctionAsync("readJSON", function(filename, cb){
  fs.readFile(filename, 'UTF8', function(err, body){
    cb(err, JSON.parse(body));
  });
});
