const path = require('path');
const fs = require('fs');
const dirs = require('../../config').dirs;

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
    }
};