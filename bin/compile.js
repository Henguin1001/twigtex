

module.exports = function(program, cb){

};
if(program.args.length == 0){
  fs.stat(file, function(err) {

  });
} else if(program.args.length == 1){

}
  module.exports = function(cb){
    if(program.args.length == 0){
      winston.warn("no files specified");
    } else {
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
    }
  };
