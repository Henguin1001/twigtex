var path = require('path'),
    fs = require('fs'),
    async = require('async'),
    program = require('commander'),
    minimist = require('minimist');

// Returns the full path to input file and a potential output file
function resolveFileName(filename){
  outfile = path.resolve(filename);
  if (outfile.includes('.twig')){
    outfile = outfile.replace(/\.twig/, '');
    if(path.extname(outfile).length === 0){
      outfile +='.tex';
    }
  } else if(path.extname(outfile)==='.tex'){
    outfile = outfile.replace(/\.tex/, 'c.tex');
  } else {
    outfile = outfile.substr(0, outfile.lastIndexOf('.')) + '.tex';
  }
  return outfile;
}


module.exports.loadProgram = function(){
  program
    .version('0.0.1')
    .usage('[options] <file ...>')
    .option('-q, --quiet', 'Supress stdout')
    .option('-v, --verbose', 'Output additional information to stdout')
    .option('-c, --compile', 'Only compile without running pdflatex')
    .option('-i, --image [directory]', 'Specify directory where resources are saved [.texdata/]', './.texdata/')
    .option('-O, --Ouput [directory]', 'Specify output directory')
    .option('-o, --output [filename]', 'Specify output file', function(output){
      return [output];
    })
    .parse(process.argv);
  program.minimist = minimist(process.argv.slice(2));
  if(program.args.length === 0){
    // TODO: zero args will read from a 'twigtex.json' file that contains settings
  } else if(program.args.length === 1){
    // make singleton array to allow for iteration
    program.filesIn = [path.resolve(program.args[0])];
    program.filesOut = [resolveFileName(program.args[0])];
  } else {
    program.filesIn = program.args.map(path.resolve);
    program.filesOut = program.args.map(resolveFileName);
  }

  return program;

}
module.exports.filesExist = function(program, cb){
  async.filter(program.task, function(inOut, next){
    fs.stat(inOut.in, function(err, stat) {
      next(err, !!err);
    });
  }, function(err){
    cb(err, program);
  });
}
