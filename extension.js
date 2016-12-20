var async = require('async'),
  twig = require('twig');

var requests = [];
var cache = [],
  cacheIterator = 0;
module.exports.extendFunctionAsync = function(name, fn){
  twig.extendFunction(name, function(){
    if(cache.length != 0){
      return cache[cacheIterator++];
    } else {
      args = Array.from(arguments);
      return requests.push({fn:fn, args:args})-1;
    }
  });
};
module.exports.loadRequests = function(cba) {
  async.map(requests, function(request, cbb){
    request.args.push(cbb);
    request.fn.apply(null, request.args);
  }, function(err, res){
    cache = res;
    cba(err, res);
  });
};
module.exports.extendFunction = twig.extendFunction;
module.exports.extendFilter = twig.extendFilter;
