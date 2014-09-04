var path = require('path'),
    shell = require('shelljs'),
    fs = require('./bench-fs'),
    benchLogger = require('./bench-logger');

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
        benchLogger('i', '[m] Minimization by ' + minimizerName + ' --> ', inputFile + ' -> ' + outputFile);

        var css = fs.readFile(inputFile),
            res = {};

        start = Date.now();

        try {
            min = minimizer[minMethod](css);
        } catch(err) {
            benchLogger('e', '[e] Minimization failed', '');
            throw err;
        }

        end = Date.now();
        res.time = end - start;

        fs.writeFile(outputFile, min);
        res.size = fs.getFileSize(outputFile);

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

        benchLogger('i', '[a] Exec bash script --> ', _command);

        shell.exec('ulimit -n 8192');
        shell.exec(_command);
        shell.mv('-f', filePath + fileSuffix, toArchCSS);

        return fs.getFileSize(path.join(toArchCSS, fileName + fileSuffix));
    };
}

module.exports = {
    minimize: minimize,
    archive: archive
}
