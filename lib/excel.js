var extend = require('./extension.js');


extend.extendFunction('excel', function(csv){
  return {
     cell:function(x, y){
       if(!y){
         
       }
     },
     formula:function(string){

     }
  };
});
