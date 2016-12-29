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
  async.filter(files, function(file, next){
    compileFile(file[0], function(err, body){
      if(err) next(err, !!err);
      else {
        console.log(file[1]);
        fs.writeFile(file[1], body, next);
      }
    });
  }, cb);
}

module.exports.compileFile = compileFile;
module.exports.compileFiles = compileFiles;
module.exports.compile = function(program, cb) {
  logger.debug(["Compiling File(s):", program.task]);
  if(program.concat){
    compileFileConcat(program.args, program.concat, program.task[0][1], function(err){
      if(err) throw err;
      else {
        logger.success("Compiled Successfully");
        cb(null);
      }
    });
  } else {
    compileFiles(program.task, function(err){
      if(err) throw err;
      else {
        logger.success("Compiled Successfully");
        cb(null);
      }
    });
  }

}
