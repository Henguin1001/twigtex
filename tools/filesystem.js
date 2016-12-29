var extend = require('../extension.js'),
  fs = require('fs');

extend.extendFunction("json_parse", function(value) {
  return JSON.parse(value);
});
extend.extendFunctionAsync("readFile", function(filename, cb){
  fs.readFile(filename, 'UTF8', cb);
});
extend.extendFunctionAsync("readJSON", function(filename, cb){
  fs.readFile(filename, 'UTF8', function(err, body){
    cb(err, JSON.parse(body));
  });
});
extend.extendFunctionAsync("require", function(filename, cb) {
  var extension = require(filename);
  // extension(extend);
});
