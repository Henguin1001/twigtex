var extend = require('./extension.js');

extend.extendFilter("escapeLatex", function(value) {
  return value.replace(/([&%\$\#_\{\}\\\^])/g, '\\$1');
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
