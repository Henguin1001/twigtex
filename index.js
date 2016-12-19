var INPUT_FILE = './test.twig.tex', OUTPUT_FILE = './output';
var twig = require('twig'),
  fs = require('fs'),
  spawn = require('child_process').spawn,
  colors = require('colors');
var tools = require('./tools.js');



twig.renderFile(INPUT_FILE, {}, (err, tex) => {
  if(!err){
      fs.writeFileSync(OUTPUT_FILE+".tex",tex);
      tools.loadImages(function(err){
        if(!err){
          setTimeout(function () {
            console.log('Rendering'.green);
            cmd = spawn('pdflatex', [OUTPUT_FILE]);
            cmd.stdout.pipe(process.stdout);
            cmd.stderr.pipe(process.stderr);
            cmd.on('close', (code) => {
              console.log(`child process exited with code ${code}`);
            });
          }, 100);

        } else throw err;
      });
  } else throw err;
});
