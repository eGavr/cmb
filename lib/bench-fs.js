var fs = require('fs'),
    _path = require('path'),
    benchLogger = require('./bench-logger');

/**
 * Makes directories
 * @param {Array} - list of paths
 */
function mkdir(path) {
    var splitPath = path.split(_path.sep),
        part = '';

    splitPath.forEach(function (nextPart) {
        part = _path.join(part, nextPart)
        try {
            fs.mkdirSync(part);
        } catch(err) {
            if (err && err.code !== 'EEXIST') {
                benchLogger('e', '[e] Can not create the folder --> ', part);
                throw err;
            }
        }
    });
}

/*
 * Returns a list of files in a dir
 * @param {String} - path to a dir
 * @returns {Array}
 */
function readDir(path) {
    try {
        return fs.readdirSync(path);
    } catch(err) {
        benchLogger('e', '[e] Can not read the dir --> ', path);
        throw err;
    }
}

/**
 * Returns the content of a file in 'utf-8' encoding
 * @param {String} - path to a file
 * @return {String}
 */
function readFile(path) {
    try {
        return fs.readFileSync(path, 'utf-8');
    } catch(err) {
        benchLogger('e', '[e] Can not read the file --> ', path);
        throw err;
    }
}

/**
 * Writes to the file
 * @param {String} - path
 * @param {String} - content
 */
function writeFile(path, content) {
    try {
        fs.writeFileSync(path, content);
    } catch(err) {
        benchLogger('e', '[e] Can not write to the file --> ', path);
        throw err;
    }
}

/**
 * Returns a size of a given file
 * @param {String} - path
 * @returns {Number}
 */
function getFileSize(path) {
    try {
        return fs.statSync(path).size;
    } catch(err) {
        benchLogger('e', '[e] Can not read the file --> ', path);
        throw err;
    }
}

module.exports = {
    mkdir: mkdir,
    readDir: readDir,
    readFile: readFile,
    writeFile: writeFile,
    getFileSize: getFileSize
}
