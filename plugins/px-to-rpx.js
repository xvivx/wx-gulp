const through = require('through2');
const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const cache = require('../utils/cache');

const pxToRpxPlugin = function () {
    return through.obj(function (file, enc, done) {
        console.log('编译wxss...');

        if(!file.isBuffer()) {
            this.emit('error', new PluginError('px-to-rpx', '仅支持Buffer类型！'));
            return done();
        }
        

        const str = file.contents.toString();

        if(str === cache.get(file.path)) return done();

        const content = str.replace(/\d+px/g, function (px, index, s) {
            return 2 * parseFloat(px) + 'rpx';
        });
        
        cache.set(file.path, content);
        file.contents = new Buffer(content);

        this.push(file);
        done();
    });
};

module.exports = pxToRpxPlugin;