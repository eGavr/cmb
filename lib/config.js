var path = require('path'),
    fs = require('fs'),
    minimize = require('./utils').minimize;

module.exports = {
    // each method is the imitation of the usage of some minimizer
    minimizers: {
        CSSO: minimize(require('csso'), 'justDoIt'),
        cleancss: minimize(new require('clean-css')(), 'minify'),
        cssshrink: minimize(require('cssshrink'), 'shrink'),
    },
    // input and output
    paths: {
        toRawCSS: path.join('css', 'raw'),
        toMinCSS: path.join('css', 'min')
    }
};
