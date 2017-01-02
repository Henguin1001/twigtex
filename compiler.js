var async = require('async'),
  fs = require('fs'),
  logger = require('./logger.js'),
  twig = require('twig'),
  extend = require('./extension.js');

// In order for async functions to be used the program renders once to
// become aware of the requests needed, It loads those requests and places them
// as plain text in the documention when rendered the second time
function compileFile(filein, cb){
  async.waterfall([
      function renderTwigOnce(next){
        logger.info(["Compiling","First pass"]);
        twig.renderFile(filein, {}, function(err) {
          if(err) logger.err(err, ["Error compiling on first pass"]);
          next(err);
        });
      }, function loadRequests(next){
        logger.info("Loading external resources");
        extend.loadRequests(function(err, data){
          if(err) logger.err(err, ["Error loading requests"]);
          next(err,data);
        });
      }, function renderFileTwice(data, next){
          logger.info(["Compiling", "Second pass"]);
          twig.renderFile(filein, {__:data}, function(err, res){
            if(err) logger.err(err, ["Error compiling on second pass"]);
            extend.clearRequests();
            next(err, res);
          });
      }
    ], cb);
}

function compileFilesConcat(filesin, delimeter, fileout, cb){
  async.map(files, compileFile, function(err, arr){
    fs.writeFile(fileout, arr.join(delimeter), cb);
  });
}
function compileFiles(files, cb){
  async.filterSeries(files, function(file, next){
    compileFile(file[0], function(err, body){
      if(err) next(err, !!err);
      else {
        fs.writeFile(file[1], body, next);
      }
    });
  }, function(err, arr){
    if(err){
      cb(err);
    } else if(arr.length > 0){
      cb("Error Compiling Files");
    } else{
      cb(null);
    }
  });
}

module.exports.compileFile = compileFile;
module.exports.compileFiles = compileFiles;
module.exports.compile = function(program, cb) {
  logger.debug(["Compiling File(s):", program.task]);
  if(program.concat){
    compileFileConcat(program.args, program.concat, program.output[0], function(err){
      if(err) throw err;
      else {
        logger.success("Compiled Successfully");
        cb(null, program);
      }
    });
  } else {
    compileFiles(program.task, function(err){
      if(err) throw err;
      else {
        logger.success("Compiled Successfully");
        cb(null, program);
      }
    });
  }

}
