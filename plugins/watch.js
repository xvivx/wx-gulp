const chokidar = require('chokidar');
const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;

const watchPlugin = function (glob, done) {
    var watcher = chokidar.watch(glob);

    watcher.on('addDir', function (path) {
        console.log(path);
    })
    return through.obj(function (file, enc, done) {

    });
};

module.exports = watchPlugin;