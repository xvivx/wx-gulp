const pxToRpx = require('../../plugins/px-to-rpx');

const gulp = require('gulp');
const plumer = require('gulp-plumber');
const appEntryPath = require('../../utils/config').entry;


module.exports = (entry, output) => {
    return (
        gulp.src(entry)
            .pipe(plumer({
                errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(pxToRpx())
            .pipe(gulp.dest(output || appEntryPath))
    );
};
