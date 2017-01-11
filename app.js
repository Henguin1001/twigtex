var path = require('path'),
    fs = require('fs'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    winston = require('winston'),
    minimist = require('minimist'),
    compiler = require('./compiler.js');

// A function to test if a array of files exists
// callback has one parameter, an error value
function filesExist(files, cb){
  async.filter(files, (file, next)=>{
    fs.stat(file, function(err, stat) {
      next(err, !!err);
    });
  }, (err, output)=>{
    if(err==null){
      winston.info('All Files Exist');
      winston.log('debug', 'All Files Exist:')
      cb(null);
    } else if(err.code == 'ENOENT') {
      winston.error('input files not found');
    } else {
      cb(err);
    }
  });
}
// A function that finds an output file to write to given an input file
// ex: template.twig.tex -> template.tex, template.twig.md -> template.md
// , template.tex -> templatec.tex, template.txt -> template.tex
function outputName(filename){
  filename = path.resolve(filename);
  // format general filename based on cases
  // if it contains twig, after templating it should no longer contain twig
  //  if the filename no longer has an extension, add .tex
  // if it only has the extension .tex to avoid overwritting the name not the extension must be changed
  // Otherwise just change the extension to .tex
  if (filename.includes('.twig')){
    filename = filename.replace(/\.twig/, '');
    if(path.extname(filename).length === 0){
      filename +='.tex';
    }
  } else if(path.extname(filename)==='.tex'){
    filename = filename.replace(/\.tex/, 'c.tex');
  } else {
    filename = filename.substr(0, filename.lastIndexOf('.')) + '.tex';
  }
  return filename;
}



// Set up the CLI arguments and their documention
var program = require('commander');
program
  .version('0.0.1')
  .usage('[options] <file ...>')
  .option('-q, --quiet', 'Supress stdout')
  .option('-v, --verbose', 'Output additional information to stdout')
  .option('-c, --compile', 'Only compile without running pdflatex')
  .option('-O, --Ouput [directory]', 'Specify output directory')
  .option('-i, --image [directory]', 'Specify directory where resources are saved [.texdata/]', './.texdata/')
  .option('-o, --output [filename]', 'Specify output file', function(output){
    return [output];
  })
  .option('-c, --concat [delimeter]', 'Concatenate output of multiple files joined by delimeter [ ]', function(cmd){
    if(cmd) return ' ';
    else return cmd;
  }, false)
  .parse(process.argv);

module.exports = function(cb){
  // Do some checks and format the command line information
  async.waterfall([
      function(next) {
        // Ensure there is a directory to write images to
        mkdirp(program.image,  (err)=>{
          if (err) winston.error('When creating image directory', err);
          else winston.info('image directory created');
          next(err);
        });
      }, function(next){
        // Verify that the files provided exist
        filesExist(program.args, function(err){
          next(err);
        })
      }, function(next){
        // Generate a list of output file directives
        if(program.concat){
           program.output = program.output || [outputName(program.args[0])];
        } else{
          program.output = program.output || program.args.map(outputName);
          program.task = program.args.map(function(filein){
            return [filein, outputName(filein)];
          });
        }
        program.latex = program.output.map(function(file){
          return path.relative(__dirname, file);
        });
        if(program.Ouput){
          program.latex.push('-output-directory ' + program.Output);
        }
        next(null);
      }, function(next){
        program.templateGlobal = [];
        program.templateGlobal.args = minimist(process.argv.slice(2));

        next(null)
      }
  ], function(err){
    if(!err){
      winston.info("Success program loaded");
      cb(null, program);
    } else throw err;

  });
};
