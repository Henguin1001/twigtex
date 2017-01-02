var async = require('async'),
  twig = require('twig'),
  winston = require('winston');

var requests = [];
var cache = [],
  cacheIterator = 0;

module.exports.extendFunctionAsync = function(name, fn){
  twig.extendFunction(name, function(){
    if(cache.length != 0){
      return cache[cacheIterator++];
    } else {
      args = Array.from(arguments);
      return requests.push({fn:fn, args:args, name: name})-1;
    }
  });
};
module.exports.loadRequests = function(cba) {
  winston.info("Loading external resources");
  if(requests.length == 0){
    winston.info("\t No external resources");
    cba(null, []);
  } else {
    async.map(requests, function(request, cbb){
      winston.debug("Loading resource from " + request.name + " args:" + request.args);
      request.args.push(cbb);
      request.fn.apply(null, request.args);
    }, function(err, res){
      cache = res;
      winston.silly("Cache: ", res);
      cba(err, res);
    });
  }
};
module.exports.clearRequests = function(){
  winston.debug("Clearing Cache");
  requests = [];
  cache = [];
  cacheIterator = 0;
}
module.exports.extendFunction = twig.extendFunction;
module.exports.extendFilter = twig.extendFilter;
