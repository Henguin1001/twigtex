var colors = require('colors'),
  util = require('util');

colors.setTheme({
  verbose: 'cyan',
  info: 'blue',
  help: 'cyan',
  warn: 'yellow',
  debug: 'cyan',
  error: 'red',
  success: 'green'
});

module.exports.verbose = function(){

}
module.exports.quiet = function(){

}
module.exports.err = function(err, details){
  console.log(colors.error(details));
  throw err;
}
module.exports.info = function(details){
  if(Array.isArray(details)){
    details.forEach(function(detail, i){
      if(i > 0){
        console.log('\t' + colors.underline(colors.info(detail)));
      } else {
        console.log(colors.info(detail));
      }
    });
  } else console.log(colors.info(details));
}
module.exports.debug = function(details){
  if(Array.isArray(details)){
    details.forEach(function(detail){
      console.log(colors.debug(util.inspect(detail, false, null)));
    });
  } else console.log(colors.debug(details));
}
module.exports.success = function(details) {
  console.log(colors.success(details));
}
