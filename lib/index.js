var fs = require('fs'),
    path = require('path'),
    shell = require('shelljs'),
    bench = require('./config'),
    utils = require('./utils'),
    minimizers = bench.minimizers,
    archivers = bench.archivers,
    toRawCSS = bench.paths.toRawCSS,
    toMinCSS = bench.paths.toMinCSS,
    toArchCSS = bench.paths.toArchCSS;

require('colors');

shell.exec('ulimit -n 8192');

// constants
var MAX_TIME = Number.MAX_VALUE;

var listOfMinimizers = Object.keys(minimizers) || [],
    listOfArchivers = Object.keys(archivers) || [],
    listOfMinLen = listOfMinimizers.length,
    listOfArchLen = listOfArchivers.length;

// makes dirs
listOfMinimizers.forEach(function (minimizer) {
    utils.mkdir(path.join(toMinCSS, minimizer));
    listOfArchivers.forEach(function (archiver) {
        utils.mkdir(path.join(toArchCSS, archiver, 'raw'));
        utils.mkdir(path.join(toArchCSS, archiver, minimizer));
    })
});

// Ok! Let's GO!
var output = '\n' + 'Result:'.bold.green + '\n',
    cssFiles = fs.readdirSync(toRawCSS);

cssFiles.forEach(function (cssFile) {
    var pathToRawFile = path.join(toRawCSS, cssFile),
        rawFileSize = fs.statSync(pathToRawFile).size;

    // minimizes and archives the file by tools which are specified in 'config.js'
    var res = {};

    if (listOfMinLen) {
        res.min = {};
    } else {
        console.log(utils.getCurrTime() + ' - ' + 'error'.red + ': [e] Spicify minimizers in \'lib/config.js\'');
        process.exit(1);
    }
    listOfArchLen && (res.arch = {});

    listOfMinimizers.forEach(function (minimizer) {
        var pathToMinCSS = path.join(toMinCSS, minimizer, cssFile),
            minimizeMethod = minimizers[minimizer];

        res.min[minimizer] = minimizeMethod(minimizer, pathToRawFile, pathToMinCSS);

        listOfArchivers.forEach(function (archiver) {
            var pathToArchCSS = path.join(toArchCSS, archiver),
                pathToRawArchCSS = path.join(pathToArchCSS, 'raw'),
                pathToMinArchCSS = path.join(pathToArchCSS, minimizer),
                archiveScript = archivers[archiver];

            if (!res.arch.hasOwnProperty(archiver)) {
                res.arch[archiver] = {};
            }
            if (!res.arch.hasOwnProperty('raw')) {
                res.arch[archiver].raw = archiveScript(cssFile, pathToRawFile, pathToRawArchCSS);
            }
            res.arch[archiver][minimizer] = archiveScript(cssFile, pathToMinCSS, pathToMinArchCSS);
        });
    });

    // gets the best and the fastest results
    var minSize = rawFileSize,
        maxSize = rawFileSize,
        minTime = MAX_TIME;

    listOfMinimizers.forEach(function (minimizer) {
        var currMinSize = res.min[minimizer].size,
            currMinTime = res.min[minimizer].time;

        minSize = Math.min(minSize, currMinSize);
        maxSize = Math.max(maxSize, currMinSize);
        minTime = Math.min(minTime, currMinTime);
    });

    var minArchSize = {},
        maxArchSize = {};

    listOfArchivers.forEach(function (archiver) {
        minArchSize[archiver] = res.arch[archiver].raw;
        maxArchSize[archiver] = res.arch[archiver].raw;
        listOfMinimizers.forEach(function (minimizer) {
            var currArchSize = res.arch[archiver][minimizer];

            minArchSize[archiver] = Math.min(minArchSize[archiver], currArchSize);
            maxArchSize[archiver] = Math.max(maxArchSize[archiver], currArchSize);
        });
    });

    // logs the test file
    var _output =
            '\n---> '.bold.green + cssFile + utils.addSymbols(40, cssFile.length, ' ') +
            ' --> ' + (rawFileSize + '').bold + ' b' + utils.addSymbols(listOfArchLen ? 22 - (rawFileSize + '').length : 2, 0, ' '),

        _outputLen =
            ('\n---> ' + cssFile + utils.addSymbols(40, cssFile.length, ' ') +
            ' --> ' + rawFileSize + ' b' + utils.addSymbols(listOfArchLen ? 22 - (rawFileSize + '').length : 2, 0, ' ')).length;

    listOfArchivers.forEach(function (archiver) {
        var currArchSize = res.arch[archiver].raw;

        _output +=
            ' + ' + archiver + ' > ' +
            (minArchSize[archiver] === currArchSize ? (currArchSize + '').green : currArchSize) + ' b' +
            utils.addSymbols((maxArchSize[archiver] + '').length + 1, (currArchSize + '').length, ' ') + '|';

        _outputLen +=
            (' + ' + archiver + ' > ' + currArchSize + ' b' +
            utils.addSymbols((maxArchSize[archiver] + '').length + 1, (currArchSize + '').length, ' ') + '|').length;
    });

    _output += '\n' + utils.addSymbols(_outputLen - 1, 0, '-');

    output += _output;

    // logs the results of the test
    listOfMinimizers.forEach(function (minimizer) {
        var currMinSize = res.min[minimizer].size,
            currMinTime = res.min[minimizer].time;

        output +=
            '\n       > was minimized by ' + minimizer + utils.addSymbols(20, minimizer.length, ' ') + '--> ' +
            (minSize === currMinSize ? (currMinSize + '').bold.green : currMinSize) + ' b' +
            utils.addSymbols((maxSize + '').length + 1, (currMinSize + '').length, ' ') + '| ' +
            (minTime === currMinTime ? (currMinTime + '').bold.green : currMinTime) + ' ms' +
            utils.addSymbols(19 - (rawFileSize + '').length, (currMinTime + ' ms').length, ' ');

        listOfArchivers.forEach(function (archiver) {
            var currArchSize = res.arch[archiver][minimizer];

            output +=
                ' + ' + archiver + ' > ' +
                (minArchSize[archiver] === currArchSize ? (currArchSize + '').bold.green : currArchSize) + ' b' +
                utils.addSymbols((maxArchSize[archiver] + '').length + 1, (currArchSize + '').length, ' ') + '|';
        });
    });

    output += '\n';
});

console.log(output + '\nDone!'.bold.green);
