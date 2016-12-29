var async = require('async'),
  app = require('./app.js')
  compiler = require('./compiler.js'),
  logger = require('./logger.js');

async.waterfall([
    app,
    compiler.compile
  ],
function(err, data){
  if(err) throw err;
  else {
    logger.success("App ran successfully");
  }
});
