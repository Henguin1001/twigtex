#!/usr/bin/env node
var async = require('async'),
  spawn = require('child_process').spawn,
  app = require('./app.js')
  compiler = require('./compiler.js'),
  winston = require('winston'),
  tools = require('./tools/');
winston.level = 'debug';
winston.addColors({
  info:'blue',
  debug:'cyan'
});
async.waterfall([
    app,
    compiler.compile,
    function runLatex(program, next){
      if(!program.compile) {
        winston.info('running pdflatex');
        cmd = spawn('pdflatex', program.latex);
        if(!program.quiet){
          cmd.stdout.pipe(process.stdout);
          cmd.stderr.pipe(process.stderr);
        }
        cmd.on('close', (code) => {
          if(code == 0){
            winston.info("pdflatex ran successfully");
            next(null);
          } else throw "error code: " + code;
        });

      } else next(null);
    }
  ],
function(err, data){
  if(err) throw err;
  else {
    winston.info("App ran successfully");
  }
});
