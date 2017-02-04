var extend = require('./extension.js'),
  fs = require('fs'),
  csv = require('csv'),
  mathjs = require('mathjs');

extend.extendFunctionAsync("readCSVRaw", function(filename, cb){
  fs.readFile(filename, 'UTF8', function(err, data){
    csv.parse(data,cb);
  });
});
extend.extendFunctionAsync("readCSV", function(filename, cb){
  fs.readFile(filename, 'UTF8', function(err, data){
    csv.parse(data,function(err,data){
      if(err) cb(err);
      else {
        cb(null, new Table(data));
      }
    });
  });
});
extend.extendFunction("math", function(formula, scope){
  return mathjs.eval(formula, scope);
});
extend.extendFunction("table", function(arr){
  var table = new Table(arr);
  return table;
});
extend.extendFilter("get", function(table, args){
  return table.get(args[0]);
});
extend.extendFilter("set", function(table, args){
  return table.set(args[0], args[1]);
});
extend.extendFilter("setEquation", function(table, args){
  return table.setEquation(args[0], args[1]);
});
extend.extendFilter("toLatex", function(table, rd){
  rd = rd? rd[0]:'\\\\\n';
  return table.toLatex(rd);
});
extend.extendFilter("size", function(table){
  return table.size();
});

function Table(data) {
  if(Array.isArray(data)){
    this.data = data;
  } else this.data = [[]];
}
Table.prototype.size = function() {
  return {width:this.data[0].length, height:this.data.length};
};
Table.prototype.range = function(query) {
  if(!query) return {};
  var temp = query.split(':');
  var c1,c2,r1,r2;
  if(temp.length > 1){
    var a = temp[0].trim(), b = temp[1].trim();
    c1 = parseInt(a.charAt(0), 36) - 10;
    c2 = parseInt(b.charAt(0), 36) - 10;
    r1 = parseInt(a.charAt(1)) -1;
    r2 = parseInt(b.charAt(1)) -1;
  } else {
    var a = temp[0].trim();
    c1 = parseInt(a.charAt(0), 36) - 10;
    c2 = c1;
    r1 = parseInt(a.charAt(1)) -1 ;
    r2 = r1;
  }
  return {c1:c1, c2:c2, r1:r1, r2:r2};
}
Table.prototype.get = function(query) {
  var range = Table.prototype.range(query);
  var raw = this.data.filter(function(row, r){
    return row.filter(function(column, c){
      return c >= range.c1 && c <= range.c2 && r >= range.r1 && r <= range.r2;
    }).length > 0;
  });
  return new Table(raw);
};
Table.prototype.set = function(query, value) {
  var range = Table.prototype.range(query);
  var raw = this.data.map(function(row, r){
    return row.map(function(column, c){
      if(c >= range.c1 && c <= range.c2 && r >= range.r1 && r <= range.r2){
        return value;
      } else return column;
    });
  });
  return new Table(raw);
};
Table.prototype.setEquation = function(query, equation) {
  var range = this.range(query);
  var selfMatrix = mathjs.matrix(this.data);
  var raw = this.data.map(function(row, r){
    var scope = {a: selfMatrix}
    row.forEach(function(column, c){
      var key = String.fromCharCode(65 + c);
      scope[key] = column;
    });
    return row.map(function(column, c){
      if(c >= range.c1 && c <= range.c2 && r >= range.r1 && r <= range.r2){
        return mathjs.eval(equation, scope);
      } else return column;
    });
  });
  return new Table(raw);
};
Table.prototype.toLatex = function(rd){
  return this.data.map(function(e){
    return e.join('&');
  }).join(rd);
};
