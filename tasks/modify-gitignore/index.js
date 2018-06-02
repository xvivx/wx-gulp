const gulp = require('gulp');
const plumer = require('gulp-plumber');

const gitignore = require('../../plugins/modify-git-ignore');
const appEntryPath = require('../../utils/config').entry;


module.exports = (entry) => {
    return (
        gulp.src(entry)
            .pipe(plumer({
                errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                }
            }))
            .pipe(gitignore())
            .pipe(gulp.dest(process.cwd()))
    );
};
