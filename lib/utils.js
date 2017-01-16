var extend = require('./extension.js');

extend.extendFilter("escapeLatex", function(value) {
  var output = value.replace(/([&%\$\#_\{\}\\\^])/g, '\\$1');
  output = output.replace(/~/g, '\\textasciitilde{}' );
  output = output.replace(/^/g, '\\^{}' );
  output = output.replace(/\\/g, '\\textbackslash{}' );
  return output;
});
extend.extendFilter("objToArr", function(value) {
  var arr = [];
  for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
          arr.push([key, obj[key]]);
      }
  };
  return arr;
});
