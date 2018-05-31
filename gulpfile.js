const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const gulpWatch = require('gulp-watch');

const less = require('./tasks/less');
const { dirs, entry, output } = require('./utils/config');
const { useLess } = require('./utils/config');
const Watch = require('./tasks/watch-dir-change');

// gulp tasks
gulp.task('watch:dir:change', () => {
    // 监控项目目录变化
    return new Watch().startWatch(dirs.appRootDir);
});

gulp.task('watch:less', () => {
    return gulpWatch(`${__dirname}/${entry}/**/*.less`, (detail) => {
        // 只针对变化的less文件进行编译
        const entry = entry + detail.path.split(entry)[1];
        const output = entry.replace(/\/\w+\.less$/, '');
        return less(entry, output);
    });
});

// 编译less
gulp.task('less', () => {
    const lessGlobs = [entry + '/**/*.less', `!${entry}/common/**/*.less`];
    
    return less(lessGlobs);
});

// 发布时复制文件到生产目录
gulp.task('copy:files', () => {
    return (
        gulp.src([
            `${entry}/**/*`, 
            `!${entry}/**/*.less`, 
            `!${entry}/**/*.+(png|jpeg|jpg|svg|gif)`
        ])
        .pipe(gulp.dest(output))
    );
});

// 压缩图片文件
gulp.task('image:min', () => {
    return (
        gulp.src(`${entry}/**/*.+(png|jpeg|jpg|svg|gif)`)
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 3,
            interlaced: true
        }))
        .pipe(gulp.dest(output))
    );
});

gulp.task('clean:output', (cb) => {
    return del(output);
});

// 开发任务
const devTasks = ['watch:dir:change'];

if(useLess) {
    devTasks.push('less', 'watch:less');
}

gulp.task('dev', devTasks);
gulp.task('build', (cb) => {
    return runSequence('clean:output', 'copy:files', 'image:min', cb);
});