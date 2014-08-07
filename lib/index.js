var fs = require('fs'),
    path = require('path'),
    csso = require('csso'),
    cleancss = new require('clean-css')(),
    cssshrink = require('cssshrink');

require('colors');

function mkdirs(paths) {
    paths.forEach(function(path) {
        fs.mkdir(path, function(err) {
            if (err && err.code !== 'EEXIST') throw err;
        });
    });
}

function addSpaces(name) {
    var spaces = '';
    for (var i = 0; i < 34 - name.length; i++) {
        spaces += ' ';
    }

    return spaces;
}

// create paths
mkdirs(['css/min', 'css/min/csso', 'css/min/cleancss', 'css/min/cssshrink']);

var toRawCSS = path.join('css', 'raw'),
    toCSSOOtput = path.join('css', 'min', 'csso'),
    toCleanCssOutput = path.join('css', 'min', 'cleancss'),
    toCssShrinkOutput = path.join('css', 'min', 'cssshrink');

// Ok! Let's GO!
var cssFiles = fs.readdirSync(toRawCSS);

cssFiles.forEach(function(cssFile) {
    console.log(
        '---> '.bold.green + cssFile + addSpaces(cssFile) +
        ' --> ' + (fs.statSync(path.join(toRawCSS, cssFile)).size + '').bold + ' b'
    );

    var css = fs.readFileSync(path.join(toRawCSS, cssFile), 'utf-8');

    var start = 0,
        end = 0;

    start = Date.now();
    var minCSSO = csso.justDoIt(css);
    end = Date.now();
    var timeCSSO = end - start;

    start = Date.now();
    var minCleanCss = cleancss.minify(css);
    end = Date.now();
    var timeCleanCss = end - start;

    start = Date.now();
    var minCssShrink = cssshrink.shrink(css);
    end = Date.now();
    var timeCssShrink = end - start;

    fs.writeFileSync(path.join(toCSSOOtput, cssFile), minCSSO);
    fs.writeFileSync(path.join(toCleanCssOutput, cssFile), minCleanCss);
    fs.writeFileSync(path.join(toCssShrinkOutput, cssFile), minCssShrink);

    var fileSizeCSSO = fs.statSync(path.join(toCSSOOtput, cssFile)).size,
        fileSizeCleanCss = fs.statSync(path.join(toCleanCssOutput, cssFile)).size,
        fileSizeCssShrink = fs.statSync(path.join(toCssShrinkOutput, cssFile)).size;

    var minSize = Math.min(fileSizeCSSO, fileSizeCleanCss, fileSizeCssShrink),
        minTime = Math.min(timeCSSO, timeCleanCss, timeCssShrink);

    console.log(
        '       > was minimized by CSSO          --> ' +
        (minSize === fileSizeCSSO ? (fileSizeCSSO + '').bold.green : fileSizeCSSO) + ' b | ' +
        (minTime === timeCSSO ? (timeCSSO + '').bold.green : timeCSSO) + ' ms'
    );

    console.log(
        '       > was minimized by clean-css     --> ' +
        (minSize === fileSizeCleanCss ? (fileSizeCleanCss + '').bold.green : fileSizeCleanCss) + ' b | ' +
        (minTime === timeCleanCss ? (timeCleanCss + '').bold.green : timeCleanCss) + ' ms'
    );

    console.log(
        '       > was minimized by cssshrink     --> ' +
        (minSize === fileSizeCssShrink ? (fileSizeCssShrink + '').bold.green : fileSizeCssShrink) + ' b | ' +
        (minTime === timeCssShrink ? (timeCssShrink + '').bold.green : timeCssShrink) + ' ms'
    );

    console.log()
});
