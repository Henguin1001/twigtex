var fs = require('fs'),
  spawn = require('child_process').spawn;

module.exports.saveTexToFile = function(program, tex, cb) {
  tex.forEach(function(contents, i){
    fs.writeFileSync(program.filesOut[i],tex);
  });
  cb(null, program);
}
module.exports.compileLatex = function(program, cb) {
    if(!program.compile) {
      console.log(program.filesOut);
      cmd = spawn('pdflatex', program.filesOut);
      cmd.stdout.pipe(process.stdout);
      cmd.stderr.pipe(process.stderr);
      cmd.on('close', (code) => {
        if(code == 0){
          cb(null);
        } else throw "error code: " + code;
      });
    } else cb(null);
}
