var async = require('async'),
  spawn = require('child_process').spawn,
  app = require('./app.js')
  compiler = require('./compiler.js'),
  logger = require('./logger.js'),
  tools = require('./tools/');

async.waterfall([
    app,
    compiler.compile,
    function runLatex(program, next){
      logger.info('running pdflatex');
      cmd = spawn('pdflatex', program.output);
      cmd.stdout.pipe(process.stdout);
      cmd.stderr.pipe(process.stderr);
      cmd.on('close', (code) => {
        if(code == 0){
          logger.success("pdflatex ran without error");
        } else throw "error code:" + code;
      });
    }
  ],
function(err, data){
  if(err) throw err;
  else {
    logger.success("App ran successfully");
  }
});
