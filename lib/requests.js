var extend = require('./extension.js'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  request = require('request');
var TEX_DATA = './.texdata/';

mkdirp(TEX_DATA, function (err) {
    if (err) throw err;
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
