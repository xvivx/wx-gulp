const fs = require('fs');
const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const plumer = require('gulp-plumber');
const runSequence = require('run-sequence');


module.exports = (globs) => {
    return (
        gulp.src(globs)
            .pipe(plumer({
                errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(less())
            .pipe(rename({
                extname: '.wxss'
            }))
            .pipe(gulp.dest('src'))
    );
}
