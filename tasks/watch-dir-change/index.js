const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const writePageTemplates = require('./writePageTemplates');
const writeCompTemplates = require('./writeCompTemplates');
const updateAppJson = require('./updateAppJson');
const updateAppConfigJson = require('./updateAppConfig');
const print = require('../../utils/log').log;

const dirs = {
    appRootDir: process.cwd()
};

const currentPageFixedTop = true;

class Watch {
    constructor() {
        this.ready = false;
        this.watcher = null;

        this.startWatch = this.startWatch.bind(this);
        this.addDirecotryListener = this.addDirecotryListener.bind(this);
        this.directoryRemovedListener = this.directoryRemovedListener.bind(this);
        this.fileRemovedListener = this.fileRemovedListener.bind(this);
        this.fileChangeListener = this.fileChangeListener.bind(this);
    }
    startWatch(dir) {
        if(this.watcher) return;
        
        this.watcher = chokidar.watch(dir);
        this.watcherDir = this.watcherDir || dir[0];
        this.watcher.on('addDir', this.addDirecotryListener);
        this.watcher.on('unlinkDir', this.directoryRemovedListener);
        this.watcher.on('unlink', this.fileRemovedListener);
        this.watcher.on('change', this.fileChangeListener);
        this.watcher.on('error', (err) => { console.log(err) });
        this.watcher.on('ready', () => {
            this.ready = true;
            console.log('文件监视已经启动。。。');
        });
    }
    addDirecotryListener(dirPath) {
        if(!this.ready) return;
        
        const files = fs.readdirSync(dirPath);

        // 判断非空目录, 除去.开头的文件
        if(files.length > 0) return;

        const dirName = dirPath.match(/[\w\$-]+$/) || [''];
        const [alias, flag] = dirName[0].split('-');

        if(/page$/.test(dirPath)) {
            const fileName = flag && alias || 'page';

            // 写入基本文件，并更新小程序的app.json, 并将当前页面设为激活页面
            writePageTemplates(dirPath, fileName);
            updateAppJson.add(dirPath, fileName);

            if(currentPageFixedTop) {
                updateAppConfigJson.add(dirPath, fileName);
            }
        } else if(/comp?$/.test(dirPath)) {
            const fileName = flag && alias || 'com';

            // 组件时仅写入文件，无需更新配置
            writeCompTemplates(dirPath, fileName);
        }
    }
    directoryRemovedListener(delDir) {
        // 更新app.json和小程序配置
        updateAppJson.del(delDir);
        updateAppConfigJson.del(delDir);
    }
    fileRemovedListener(filePath) {
        // console.log('File', filePath, '被删除');
    }
    fileChangeListener(filePath) {
        if(!this.ready || !currentPageFixedTop) return;
        // 防止框架自己同时修改多个文件引起频繁的IO, 限流500ms
        this.pause(500);

        const fileRelativeRootPath = filePath.replace(this.watcherDir + '/', '');

        if(fileRelativeRootPath === 'app.json' || fileRelativeRootPath === 'project.config.json') {
            return;
        }
        
        const absPath = fileRelativeRootPath.split('.')[0];
        updateAppConfigJson.top(absPath);
    }
    pause(time = 2000) {
        this.ready = false;

        setTimeout(() => {
            this.ready = true;
        }, time);
    }
};

module.exports = Watch;