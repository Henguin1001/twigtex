#!/usr/bin/env node
var async = require('async'),
  winston = require('winston'),
  mkdirp = require('mkdirp'),
  twigtex = require('../lib/twigtex.js'),
  program = require('./program.js'),
  latex = require('./latex.js');

async.waterfall([
  function loadProgram(next){
    next(null, program.loadProgram());
  }, program.filesExist, function createImageDirectory(program, next){
    mkdirp(program.image, function(err){
      next(err, program);
    });
  }, function compileTwig(program, next){
    twigtex(program.filesIn, function(err, res){
      next(err, program, res);
    }, {globals:program.minimist});
  }, latex.saveTexToFile, latex.compileLatex
], function(err, data){
  if(err) throw err;
  else {
    console.log("Success");
  }
});
