var twig = require('twig'),
  fs = require('fs'),
  extend = require('./extension.js'),
  spawn = require('child_process').spawn,
  colors = require('colors');

module.exports.compile =  function (filein, fileout, cb){
  console.log(colors.blue('Compiling '+ colors.underline('First Pass')));
  twig.renderFile(filein, {}, (err) => {
    if(err) throw err;
    console.log(colors.cyan('Loading external resources'));
    extend.loadRequests((err, data) => {
      if(!err){
        console.log(colors.blue('Compiling '+ colors.underline('Second Pass')));
        twig.renderFile(filein, {__:data}, function(err, res){
          if(!err){
            fs.writeFileSync(fileout, res);
            cb(err, res);
          } else throw err;
        });
      } else throw err;
    });
  });
}
module.exports.render = function(filename, cb){
  console.log(colors.green("writing tex output to file: " + colors.underline(filename)));
  console.log(colors.blue("running pdflatex"));
  cmd = spawn('pdflatex', [filename]);
  cmd.stdout.pipe(process.stdout);
  cmd.stderr.pipe(process.stderr);
  cmd.on('close', (code) => {
    if(code == 0){
      console.log(colors.green("Success, pdflatex ran without error"));
    } else throw "error code:" + code;
    if(cb)
      cb(code);
  });
}
