var twig = require('twig'),
  fs = require('fs'),
  spawn = require('child_process').spawn,
  colors = require('colors');

var extend = require('./extension.js'),
  tools = require('./tool.js');

var INPUT_FILE = './test.twig.tex', OUTPUT_FILE = './output.tex';
compile(INPUT_FILE, function(err, tex){
  if(!err){
    render(OUTPUT_FILE, tex);
  } else throw err;
});

function compile(filename, cb){
  console.log(colors.blue('Compiling '+ colors.underline('First Pass')));
  twig.renderFile(filename, {}, (err) => {
    console.log(colors.cyan('Loading external resources'));
    extend.loadRequests((err, data) => {
      if(!err){
        console.log(colors.blue('Compiling '+ colors.underline('Second Pass')));
        twig.renderFile(filename, {__:data}, cb);
      } else throw err;
    });
  });
}
function render(filename, tex, cb){
  console.log(colors.green("writing tex output to file: " + colors.underline(filename)));
  fs.writeFileSync(filename, tex);
  console.log(colors.blue("running pdflatex"));
  cmd = spawn('pdflatex', [OUTPUT_FILE]);
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
