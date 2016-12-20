var twig = require('twig'),
  fs = require('fs'),
  url = require('url'),
  request = require('request'),
  requestSync = require('sync-request'),
  colors = require('colors'),
  async = require('async'),
  gravatar = require('gravatar');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};
var images = [];


twig.extendFunction("require", function(filename) {
  return require(filename);
});
twig.extendFunction("request", function(URL) {
  console.log(colors.blue("Getting " + URL + " ..."));
  return requestSync('GET', URL).getBody();
});
twig.extendFunction("requestJSON", function(URL) {
  console.log(colors.blue("Getting " + URL + " ..."));
  return JSON.parse(requestSync('GET', URL).getBody());
});
twig.extendFunction("requestImage", function(URL, extension) {
  var location = URL.split('/').pop()+extension;
  images.push([URL,location]);
  return "./bin/"+location;
});
twig.extendFunction("gravatar", function(email) {
  var URL = gravatar.url(email, {s: '100', r: 'x', d: 'retro'}, true);
  var location = URL.split('/').pop();
  location = location.replace(/[^a-z0-9]/gi, '_').toLowerCase() + ".jpg";
  images.push([URL, location]);
  return "./bin/" + location;
});

twig.extendFilter("json_parse", function(value) {
  return JSON.parse(value);
});

module.exports.loadImages = function(cb){
  var i = 1;
  async.filter(images, function(URL, cb){
    download(URL[0], "./bin/"+URL[1], function(err){
      console.log(colors.cyan("Downloading image " + i+" of " + images.length));
      console.log(colors.cyan("\tFrom " + URL[0] + " to location ./bin/" + URL[1]));
      i++;
      cb(err, !err);
    });
  }, cb);
}
