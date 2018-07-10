const path = require('path');
const { readAppJson, writeAppJson } = require('../../utils/handleAppFile');
const print = require('../../utils/log').log;


module.exports = {
    getPackageIndex(packageName, subPackages) {
        for(let i = 0, len = subPackages.length; i < len; i++) {
            if(subPackages[i].root === packageName) {
                return i;
            }
        }

        return -1;
    },
    add(fileDir, fileName, rootDir) {
        const appJson = readAppJson();
        const subPackages = appJson.subPackages || [];
        const pathName = path.relative(rootDir, fileDir + '/' + fileName);
        const packageRoot = pathName.split('/')[0];

        // 主包比较复杂，不规范的项目可能页面所在目录无法预估，所以先判断副包
        let packageIndex = this.getPackageIndex(packageRoot, subPackages);

        // 这种情况在主包里
        if(packageIndex === -1) {
            // 把新加的页面写入app.json
            appJson.pages.push(pathName);
        } else {
            // 写入副包
            subPackages[packageIndex].pages.push(pathName.replace(packageRoot + '/', ''));
        }

        writeAppJson(appJson);
        print(`新增${fileDir}下的页面`, 'yellow');
    }, 
    del(fileDir, rootDir) {
        const appJson = readAppJson();
        const subPackages = appJson.subPackages || [];
        const pathName = path.relative(rootDir, fileDir);
        const packageName = pathName.split('/')[0];

        let packageIndex = this.getPackageIndex(packageName, subPackages);

        if(packageIndex === -1) {
            const reg = new RegExp('^' + pathName);
            // 把删除的文件夹下的所有页面从app.json中移除
            appJson.pages = appJson.pages.filter(item => {
                return !reg.test(item);
            });
        } else {
            const reg = new RegExp('^' + pathName.replace(packageName + '/', ''));
            // 在副包中删除相应的页面
            subPackages[packageIndex].pages = subPackages[packageIndex].pages.filter(page => {
                return !reg.test(page);
            });
        }

        writeAppJson(appJson);
    }
};