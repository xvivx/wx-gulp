const path = require('path');
const fs = require('fs');
const dirs = require('../../config').dirs;

module.exports = {
    add(fileDir, fileName) {
        const appJson = JSON.parse(fs.readFileSync(dirs.appJsonDir, { encoding: 'utf8' }));
        const pathName = path.relative(dirs.appRootDir, fileDir + '/' + fileName);
        // 把新加的页面写入app.json
        appJson.pages.push(pathName);

        fs.writeFileSync(dirs.appJsonDir, JSON.stringify(appJson, null, 4));
    }, 
    del(fileDir) {
        const appJson = JSON.parse(fs.readFileSync(dirs.appJsonDir, { encoding: 'utf8' }));
        const pathName = path.relative(dirs.appRootDir, fileDir);
        const reg = new RegExp('^' + pathName);

        // 把删除的文件夹下的所有页面从app.json中移除
        const pages = appJson.pages.filter(item => {
            return !reg.test(item);
        });

        appJson.pages = pages;
        fs.writeFileSync(dirs.appJsonDir, JSON.stringify(appJson, null, 4));
    }
};