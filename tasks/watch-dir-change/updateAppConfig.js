const path = require('path');
const fs = require('fs');
const dirs = require('../../config').dirs;
const console = require('../../utils/log');

module.exports = {
    add(fileDir, fileName) {
        // fileName不含后缀, 由于小程序每个页面或组件下4个文件的名字一样，这里默认的就是无后缀的js文件
        const configJson = JSON.parse(fs.readFileSync(dirs.configJsonDir, { encoding: 'utf8' }));
        const miniprogram = configJson.condition.miniprogram;
        const pathName = path.relative(dirs.appRootDir, fileDir + '/' + fileName);

        miniprogram.list.push({
            id: Date.now(),
            name: fileName,
            pathName: pathName,
            query: ''
        });

        miniprogram.current = miniprogram.list.length - 1;
        fs.writeFileSync(dirs.configJsonDir, JSON.stringify(configJson, null, 4));
    }, 
    del(fileDir) {
        const configJson = JSON.parse(fs.readFileSync(dirs.configJsonDir, { encoding: 'utf8' }));
        const miniprogram = configJson.condition.miniprogram;
        const pathName = path.relative(dirs.appRootDir, fileDir);
        const reg = new RegExp('^' + pathName);

        miniprogram.list = miniprogram.list.filter(item => {
            return !reg.test(item.pathName);
        });

        miniprogram.current = -1;
        fs.writeFileSync(dirs.configJsonDir, JSON.stringify(configJson, null, 4));
    },
    top(pathName) {
        const appJson = JSON.parse(fs.readFileSync(dirs.appJsonDir, { encoding: 'utf8' }));
        const pages = appJson.pages;

        let index = pages.indexOf(pathName);

        // 如果页面中没有该路径说明不是页面
        if(index === -1) {
            return;
        }

        index = -1;

        const configJson = JSON.parse(fs.readFileSync(dirs.configJsonDir, { encoding: 'utf8' }));
        const miniprogram = configJson.condition.miniprogram;
        
        for(let i = 0, length = miniprogram.list.length; i < length; i++) {
            if(miniprogram.list[i].pathName === pathName) {
                index = i;
                break;
            }
        }

        // 说明配置模式中并没有该页面， 加进去
        if(index === -1) {
            miniprogram.list.push({
                id: Date.now(),
                name: pathName.replace(/\//g, '-'),
                pathName: pathName,
                query: ''
            });

            index = miniprogram.list.length - 1;
        }

        if(index === miniprogram.current) {
            return;
        }

        miniprogram.current = index;
        fs.writeFileSync(dirs.configJsonDir, JSON.stringify(configJson, null, 4));
        console.log(`已将${pathName}下的页面置顶`, 'green');
    }
};