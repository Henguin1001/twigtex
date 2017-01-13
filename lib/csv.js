var extend = require('./extension.js'),
  fs = require('fs'),
  csv = require('csv');

extend.extendFunctionAsync("readCSVRaw", function(filename, cb){
  fs.readFile(filename, 'UTF8', function(err, data){
    csv.parse(data,cb);
  });
});
