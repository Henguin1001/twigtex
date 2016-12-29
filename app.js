var path = require('path'),
    fs = require('fs'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    logger = require('./logger.js'),
    compiler = require('./compiler.js');


var program = require('commander');
program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-q, --quiet', 'Supress stdout', logger.quiet)
  .option('-v, --verbose', 'Output additional information to stdout', logger.verbose)
  .option('-c, --concat [delimeter]', 'Concatatinate output of multiple files joined by delimeter [ ]', ' ')
  .option('-o, --output [filename]', 'Specify output file [output.tex]', './output.tex')
  .option('-i, --image [directory]', 'Specify directory where resources are saved [.texdata/]', './.texdata/')
  .parse(process.argv);

async.waterfall([
    function(next) {
      mkdirp(program.image,  (err)=>{
        if (err) logger.err(err, ["When creating image directory", program.image]);
        next(err);
      });
    },
    function(data, next) {
      async.filter(program.args, (file, cb)=>{
        fs.stat(file, function(err, stat) {
          cb(err, err);
        });
      }, (err, output)=>{
        if(output.length!=0){
          logger.err(err, ["input files not found", output]);
        }
        next(err);
      });
    }
],
function(){
    if(err) throw err;
    else console.log('we are done');
});
