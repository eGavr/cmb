var fs = require('fs'),
    path = require('path'),
    bench = require('./config'),
    utils = require('./utils'),
    minimizers = bench.minimizers,
    toRawCSS = bench.paths.toRawCSS,
    toMinCSS = bench.paths.toMinCSS;

require('colors');

// constants
var maxSize = Number.MAX_VALUE,
    maxTime = Number.MAX_VALUE;

var listOfMinimizers = Object.keys(minimizers);

// makes dirs
utils.mkdir(toMinCSS);
listOfMinimizers.forEach(function(minimizer) {
    utils.mkdir(path.join(toMinCSS, minimizer));
});

// Ok! Let's GO!
var cssFiles = fs.readdirSync(toRawCSS);

cssFiles.forEach(function(cssFile) {
    var pathToFile = path.join(toRawCSS, cssFile);

    // logs the test file
    console.log(
        '---> '.bold.green + cssFile + utils.addSpaces(cssFile, 40) +
        ' --> ' + (fs.statSync(pathToFile).size + '').bold + ' b'
    );

    // minimizes the file by different minimizers which are specified in 'config.js'
    var res = {};
    listOfMinimizers.forEach(function(minimizer) {
        res[minimizer] = minimizers[minimizer](pathToFile, path.join(toMinCSS, minimizer, cssFile));
    });

    // gets the best and the fastest results
    var minSize = maxSize,
        minTime = maxTime;
    listOfMinimizers.forEach(function(minimizer) {
        minSize = Math.min(minSize, res[minimizer].size);
        minTime = Math.min(minTime, res[minimizer].time);
    });

    // logs the results of the test
    listOfMinimizers.forEach(function(minimizer) {
        console.log(
            '       > was minimized by ' + minimizer + utils.addSpaces(minimizer, 20) + '--> ' +
            (minSize === res[minimizer].size ? (res[minimizer].size + '').bold.green : res[minimizer].size) + ' b | ' +
            (minTime === res[minimizer].time ? (res[minimizer].time + '').bold.green : res[minimizer].time) + ' ms'
        );
    });

    console.log()
});
