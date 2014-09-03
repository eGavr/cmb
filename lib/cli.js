var path = require('path'),
    bench = require('./index');

module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .title('Сompares the work of CSS minimizers')
    .opt()
        .name('version')
        .title('Shows the version number')
        .short('v').long('version')
        .flag()
        .only()
        .act(function () {
            var p = require('../package.json');
            return p.name + ' ' + p.version;
        })
        .end()
    .opt()
        .name('output')
        .title('Path to the result output file')
        .short('o').long('output')
        .end()
    .act(function (opts) {
        bench.compare(opts);
    })
    .run(process.argv.slice(2));
