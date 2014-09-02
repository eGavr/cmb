var fs = require('fs'),
    path = require('path'),
    shell = require('shelljs');

require('colors');

/**
 * Returns current time in an appropriate form
 * @example 00:00:00.000
 */
function getCurrTime() {
    var now = new Date(),
        _hours = now.getHours() + '',
        _minutes = now.getMinutes() + '',
        _seconds = now.getSeconds() + '',
        _milliseconds = now.getMilliseconds() + '',
        hours = (_hours.length < 2 ? '0' :  '') + _hours,
        minutes = (_minutes.length < 2 ? '0' : '') + _minutes,
        seconds = (_seconds.length < 2 ? '0' : '') + _seconds,
        milliSecLen = _milliseconds.length,
        milliseconds = (milliSecLen < 3 ? (milliSecLen === 2 ? '0' : '00') : '') +  _milliseconds;

    return (hours + ':' + minutes + ':' + seconds + '.' + milliseconds).grey;
}

/**
 * Makes directories
 * @param {Array} - list of paths
 */
function mkdir(_path) {
    var splitPath = _path.split(path.sep),
        part = '';

    splitPath.forEach(function (nextPart) {
        part = path.join(part, nextPart)
        try {
            fs.mkdirSync(part);
        } catch(err) {
            if (err && err.code !== 'EEXIST') {
                console.log(getCurrTime() + ' - ' + 'error'.red + ': [e] Can not create the folder --> ' + part);
                throw err;
            }
        }
    });
}

/**
 * Adds spaces for pretty logging
 * @param {String} - string in the log
 * @param {Number} - interval
 * @returns {String}
 */
function addSymbols(interval, nameLen, symbol) {
    return new Array(interval - nameLen + 1).join(symbol);
}

/**
 * Returns a function which can minimize CSS
 * @param {Module} - a required module of a minimizer
 * @param {String} - minimization method of a minimizer which receives CSS and minifies it
 * @return {Function}
 */
function minimize(minimizer, minMethod) {
    /**
     * Returns a size of a minimized file and time of a minimizer's work
     * @param {Object} - required minimizer's module
     * @param {String} - name of minimizer's method
     * @returns {Object}
     */
    return function (minimizerName, inputFile, outputFile) {
        console.log(
            getCurrTime() + ' - ' + 'info'.green + ': [m] Minimization by ' + minimizerName + ' --> ' +
            (inputFile + ' -> ' + outputFile).grey
        );

        var css = fs.readFileSync(inputFile, 'utf-8'),
            res = {};

        start = Date.now();
        min = minimizer[minMethod](css);
        end = Date.now();
        res.time = end - start;

        fs.writeFileSync(outputFile, min);
        res.size = fs.statSync(outputFile).size;

        return res;
    };
}

/**
 * Returns a function which can archive files
 * @param {String} - bash scrit which archive files
 * @param {String} - suffix which is added to archived file's name after archiving
 * @return {Function}
 */
function archive(command, fileSuffix) {
    /**
     * Returns a size of an arhived file of an archiver's work
     * @param {String} - file name
     * @param {String} - file path
     * @param {String} - path to archived CSS
     * @returns {Number}
     */
    return function (fileName, filePath, toArchCSS) {
        var _command = command
                .replace(/\[FILE_PATH\]/g, filePath)
                .replace(/\[TO_ARCH_CSS\]/g, toArchCSS);

        console.log(getCurrTime() + ' - ' + 'info'.green + ': [a] ' + 'Exec bash script --> ' + _command.grey);

        shell.exec(_command);

        return fs.statSync(path.join(toArchCSS, fileName + fileSuffix)).size;
    };
}

module.exports = {
    getCurrTime: getCurrTime,
    mkdir: mkdir,
    addSymbols: addSymbols,
    minimize: minimize,
    archive: archive
}
