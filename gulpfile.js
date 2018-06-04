const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const del = require('del');
const imagemin = require('gulp-imagemin');
const runSequence = require('run-sequence');
const gulpWatch = require('gulp-watch');

const less = require('./tasks/less');
const wxss = require('./tasks/wxss');
const gitignore = require('./tasks/modify-gitignore');
const Watch = require('./tasks/watch-dir-change');
const { dirs, entry, output } = require('./utils/config');
const { useLess } = require('./utils/config');
const print = require('./utils/log').log;

const appRootDir = process.cwd();


module.exports = function () {
    // gulp tasks
    gulp.task('watch:dir:change', () => {
        // 监控项目目录变化
        return new Watch().startWatch([appRootDir, '!' + appRootDir + '/wx-gulp/**/*.*', '!' + appRootDir + '/gulpfile.js']);
    });
    
    
    gulp.task('modify:gitignore', () => {
        return gitignore(__dirname + '/.gitignore');
    });
    
    // 编译wxss
    gulp.task('wxss', () => {
        const wxssGlobs = [appRootDir + '/**/*.wxss'];
        
        return wxss(wxssGlobs).on('finish', () => {
            print('wxss编译完毕。', 'green');
        });
    });
    
    gulp.task('watch:wxss', () => {
        return gulpWatch(`${appRootDir}/**/*.wxss`, (detail) => {
            // 只针对变化的less文件进行编译
            if(detail.event === 'change') {
                const input = entry + '/' + path.relative(dirs.appRootDir, detail.path);
                const output = input.replace(/\/\w+\.wxss$/, '');
    
                return wxss(input, output);
            }
        });
    });
    
    gulp.task('watch:less', () => {
        return gulpWatch(`${appRootDir}/**/*.less`, (detail) => {
            if(detail.event === 'change') {
                // 只针对变化的less文件进行编译
                const input = entry + '/' + path.relative(dirs.appRootDir, detail.path);
                const output = input.replace(/\/\w+\.less$/, '');
    
                return less(input, output);
            }
        });
    });
    
    // 编译less
    gulp.task('less', () => {
        const lessGlobs = [appRootDir + '/**/*.less'];
        
        return less(lessGlobs);
    });
    
    // 发布时复制文件到生产目录
    gulp.task('copy:files', () => {
        return (
            gulp.src([
                `${appRootDir}`, 
                `!${appRootDir}/**/*.less`, 
                `!${appRootDir}/wx-gulp`, 
                `!${appRootDir}/gulpfile.js`, 
                `!${appRootDir}/package.json`, 
                `!${appRootDir}/yarn.lock`, 
                `!${appRootDir}/**/*.+(png|jpeg|jpg|svg|gif)`
            ])
            .pipe(gulp.dest(output))
        );
    });
    
    // 压缩图片文件
    gulp.task('image:min', () => {
        return (
            gulp.src(`${appRootDir}/**/*.+(png|jpeg|jpg|svg|gif)`)
            .pipe(imagemin({
                progressive: true,
                optimizationLevel: 7,
                interlaced: true
            }))
            .pipe(gulp.dest(output))
        );
    });
    
    gulp.task('clean:output', (cb) => {
        return del(output);
    });
    
    // 开发任务
    const devTasks = ['watch:dir:change', 'watch:wxss'];
    
    if(useLess) {
        // devTasks.push('less', 'watch:less');
    }
    
    gulp.task('dev', (cb) => {
        return runSequence(devTasks, cb);
    });
    gulp.task('build', (cb) => {
        return runSequence('clean:output', 'copy:files', 'image:min', cb);
    });
}