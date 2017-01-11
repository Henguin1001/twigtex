var async = require('async'),
  fs = require('fs'),
  winston = require('winston'),
  twig = require('twig'),
  extend = require('./extension.js');

// In order for async functions to be used the program renders once to
// become aware of the requests needed, It loads those requests and places them
// as plain text in the documention when rendered the second time
function compileFile(filein, globals, cb){
  async.waterfall([
      function renderTwigOnce(next){
        winston.info("Compiling First pass");
        twig.renderFile(filein, globals, function(err) {
          if(err) winston.error("Error compiling on first pass", err);
          next(err);
        });
      }, function loadRequests(next){
        extend.loadRequests(function(err, data){
          if(err) winston.error("Error loading requests" , err);
          next(err,data);
        });
      }, function renderFileTwice(data, next){
          winston.info("Compiling Second pass");
          globals.cache = data;
          twig.renderFile(filein, {__:globals}, function(err, res){
            if(err) winston.error("Error compiling on second pass", err);
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
function compileFiles(files, globals, cb){
  async.filterSeries(files, function(file, next){
    compileFile(file[0], globals, function(err, body){
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
  winston.debug("Compiling File(s):", program.args);
  if(program.concat){
    compileFileConcat(program.args, program.concat, program.output[0], function(err){
      if(err) throw err;
      else {
        winston.info("Compiled Successfully");
        cb(null, program);
      }
    });
  } else {
    compileFiles(program.task, program.templateGlobal, function(err){
      if(err) throw err;
      else {
        winston.info("Compiled Successfully");
        cb(null, program);
      }
    });
  }

}
