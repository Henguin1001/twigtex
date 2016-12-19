var mu = require('mu2'), fs = require('fs'), latex = require('latex');
var view = require('./view.json');
var output = fs.createWriteStream('./output.tex'),
    outputPDF = fs.createWriteStream('./output.pdf'),
  templateIstream = mu.compileAndRender('./template.tex', view);
var templateString = "";
templateIstream.pipe(output);
templateIstream.on('data', function(data){
  templateString+=data;
});
templateIstream.on('end',function(){
  templateString = templateString.split('\n');
  latex(templateString).pipe(outputPDF);
});
