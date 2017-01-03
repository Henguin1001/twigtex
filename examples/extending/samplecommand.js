module.exports = function(extension){
  extension.extendFunctionAsync('test',function(cb){
    cb(null,"Hello World");
  });
}
