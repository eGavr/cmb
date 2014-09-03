var path = require('path'),
    utils = require('../lib/utils'),
    minimize = utils.minimize,
    archive = utils.archive;

module.exports = {
    // each method is the imitation of the usage of some minimizer
    minimizers: {
        CSSO: minimize(require('csso'), 'justDoIt'),
        cleancss: minimize(new require('clean-css')(), 'minify'),
        cssshrink: minimize(require('cssshrink'), 'shrink'),
        csswring: minimize(require('csswring'), 'wring')
    },
    // each method is the imitation of the usage of some archiver
    archivers: {
        gzip: archive('gzip -k [FILE_PATH] && mv [FILE_PATH].gz [TO_ARCH_CSS]', '.gz')
    },
    // input and output
    paths: {
        toRawCSS: path.join('css', 'raw'),
        toMinCSS: path.join('css', 'min'),
        toArchCSS: path.join('css', 'arch')
    }
};
