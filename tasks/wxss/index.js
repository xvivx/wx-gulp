const gulp = require('gulp');
const plumer = require('gulp-plumber');

const pxToRpx = require('../../plugins/px-to-rpx');


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
            .pipe(gulp.dest(output))
    );
};
