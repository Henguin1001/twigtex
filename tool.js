var extend = require('./extension.js'),
  fs = require('fs'),
  request = require('request'),
  csv = require('csv');
var TEX_DATA = './bin/';

extend.extendFunction("require", function(filename) {
  return require(filename);
});
extend.extendFunction("json_parse", function(value) {
  return JSON.parse(value);
});
extend.extendFunctionAsync("readFile", function(filename, cb){
  fs.readFile(filename, 'UTF8', cb);
});
extend.extendFunctionAsync("readCSVRaw", function(filename, cb){
  fs.readFile(filename, 'UTF8', function(err, data){
    csv.parse(data,cb);
  });
});
extend.extendFunctionAsync("readCSV", function(filename, rows, columns, cb){
  fs.readFile(filename, 'UTF8', function(err, data){
    csv.parse(data,function(err, data){
      if(!err){
        cb(undefined, function(){
          
        });
      }else throw err;
    });
  });
});
extend.extendFunctionAsync("requestRaw", function(URL, cb){
  request(URL, function (err, response, body) {
    cb(err, body);
  });
});
extend.extendFunctionAsync("requestJSON", function(URL, cb){
  request(URL, function (err, response, body) {
    cb(err, JSON.parse(body));
  });
});
extend.extendFunctionAsync("requestImage", function(URL, extension, cb){
  var location = TEX_DATA+URL.split('/').pop()+extension;
  request.head(URL, function(err, res, body){
    request(URL).pipe(fs.createWriteStream(location)).on('close', function(err){
      cb(err, location);
    });
  });
});
