const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;

const { entry, output } = require('../utils/config');

module.exports = function () {
    return through.obj(function (file, enc, done) {
        if(!file.isBuffer()) {
            this.emit('error', new PluginError('modify-git-ignore', '仅支持Buffer类型！'));
            return done();
        }

        const str = file.contents.toString();
        const entryReg = new RegExp('\/' + entry);
        const outputReg = new RegExp('\/' + output);

        let content = '';

        if(!entryReg.test(str)) {

            content = str + '\n' + '\/' + entry + '/\n';
        }

        if(!outputReg.test(str)) {

            content = str + '\n' + '\/' + output + '/\n';
        }

        if(!content) return done();
        
        file.contents = new Buffer(content);

        this.push(file);
        done();
    });
};