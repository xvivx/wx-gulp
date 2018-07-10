const path = require('path');
const gulp = require('gulp');
const del = require('del');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const gulpWatch = require('gulp-watch');

const less = require('./tasks/less');
const wxss = require('./tasks/wxss');
const Watch = require('./tasks/watch-dir-change');

module.exports = function (appRootDir = process.cwd(), outputDir = appRootDir + '/dist') {
    // gulp tasks
    gulp.task('watch:dir:change', () => {
        // 监控项目目录变化
        return new Watch().startWatch([appRootDir]);
    });
    
    
    // 编译wxss
    gulp.task('wxss', () => {
        return wxss([appRootDir + '/**/*.wxss']);
    });
    
    gulp.task('watch:wxss', () => {
        const globs = [`${appRootDir}/**/*.wxss`];

        return gulpWatch(globs, (detail) => {
            // 只针对变化的less文件进行编译
            if(detail.event === 'change') {
                const input = path.resolve(appRootDir, detail.path);
                const output = input.replace(/\/\w+\.wxss$/, '');
                return wxss(input, output);
            }
        });
    });
    
    gulp.task('watch:less', () => {
        const globs = [`${appRootDir}/**/*.less`];

        return gulpWatch(globs, (detail) => {
            if(detail.event === 'change') {
                // 只针对变化的less文件进行编译
                const input = path.resolve(appRootDir, detail.path);
                const output = input.replace(/\/\w+\.less$/, '');
    
                return less(input, output);
            }
        });
    });
    
    // 编译less
    gulp.task('less', () => {
        return less([appRootDir + '/**/*.less']);
    });
    
    // 发布时复制文件到生产目录
    gulp.task('copy:files', () => {
        const globs = [
            `${appRootDir}/**`,
            `!${appRootDir}/**/*.less`,
            `!${appRootDir}/**/*.+(png|jpeg|jpg|svg|gif)`
        ];

        return gulp.src(globs).pipe(gulp.dest(outputDir));
    });
    
    // 压缩图片文件
    gulp.task('image:min', () => {
        const globs = [`${appRootDir}/**/*.+(png|jpeg|jpg|svg|gif)`];

        return (
            gulp.src(globs)
            .pipe(imagemin({
                optimizationLevel: 7,
                progressive: true,
                interlaced: true,
                multipass: true
            }))
            .pipe(gulp.dest(outputDir))
        );
    });
    
    gulp.task('clean:output', (cb) => {
        return del(outputDir);
    });
    
    // 开发任务
    const devTasks = ['watch:wxss', 'watch:dir:change'];
    
    gulp.task('dev', (cb) => {
        return runSequence(devTasks, cb);
    });

    // 生产发布
    gulp.task('build', (cb) => {
        return runSequence('clean:output', ['copy:files', 'image:min'], cb);
    });
};