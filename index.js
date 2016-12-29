var compile = require('./compile.js'),
  tools = require('./tools/'),
  path = require('path'),
  argv = require('minimist')(process.argv.slice(2));


var INPUT_FILE = './'+argv._[0];
if(argv.o){
  OUTPUT_FILE = './'+argv.o;
} else if (INPUT_FILE.includes('.twig')){
  OUTPUT_FILE = INPUT_FILE.replace(/\.twig/, '');
  if(path.extname(OUTPUT_FILE).length == 0){
    OUTPUT_FILE+='.tex';
  }
} else if(path.extname(INPUT_FILE)=='.tex'){
  OUTPUT_FILE = './output.tex';
} else {
  OUTPUT_FILE = OUTPUT_FILE.substr(0, OUTPUT_FILE.lastIndexOf(".")) + ".tex";
}
compile.compile(INPUT_FILE, OUTPUT_FILE, function(err, tex){
  if(!err){
    if(!argv.c){
      compile.render(OUTPUT_FILE);
    }
  } else throw err;
});
