#!/usr/bin/env node

var chokidar = require('chokidar')
  , sass = require('node-sass')
  , fs = require('fs')
  , path = require('path')
  , inputDir = path.join(process.cwd(), process.argv[2])
  , outputDir = path.join(process.cwd(), process.argv[3])
  , watcher = chokidar.watch(inputDir, {persistent: true});

console.log("Input: " + inputDir, "Output: " + outputDir)

watcher
  .on('add', function(changePath) {
    var css = sass.renderSync({
      file: changePath
    })
    updateFile(changePath, css)
    console.log('File', changePath, 'has been added');
  })
  .on('change', function(changePath) {
    var css = sass.renderSync({
      file: changePath
    })
    updateFile(changePath, css)
    console.log('File', changePath, 'has been changed');
  })
  .on('unlink', function(changePath) {
    fs.unlinkSync(path.join(outputDir, path.normalize(changePath.replace(inputDir, '').replace('.scss','.css'))))
    console.log('File', changePath, 'has been removed');
  })
  .on('error', function(error) {
    console.error('ONOEZ', error);
  });

function updateFile(changePath, css) {
  fs.writeFileSync(path.join(outputDir, path.normalize(changePath.replace(inputDir, '').replace('.scss','.css'))), css)
}
