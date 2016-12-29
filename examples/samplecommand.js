module.exports = function(extension){
  extension.extendFunction('test',function(){
    return "Hello World";
  });
}
