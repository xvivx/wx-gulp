const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gulpWatch = require('gulp-watch');

const less = require('./tasks/less');
const Watch = require('./tasks/watch-dir-change');
const { dirs, appName, commonPath } = require('./config');

// 监控项目目录变化
new Watch().startWatch(dirs.appRootDir);


// gulp tasks
gulp.task('watch:less', () => {
    return gulpWatch(`${__dirname}/${appName}/**/*.less`, (detail) => {
        const entry = appName + detail.path.split(appName)[1];
        const output = entry.replace(/\/\w+\.less$/, '');
        return less(entry, output);
    });
});

gulp.task('less', () => {
    const lessGlobs = [appName + '/**/*.less', `!${appName}/common/**/*.less`];
    
    return less(lessGlobs);
})

gulp.task('default', ['less', 'watch:less']);