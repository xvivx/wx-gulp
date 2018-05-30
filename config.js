const path = require('path');

let custom = null;

try {
    custom = require('./custom');
} catch (e) {
    console.log('未配置custom.js，按默认配置启动...');
    custom = {};
}

const appName = custom.appName || 'app';
const commonDir = custom.commonDir || '/common';
const appRootPath = path.resolve(__dirname, appName);

module.exports = {
    appName: appName,
    dirs: {
        commonDir: commonDir,
        appRootDir: appRootPath,
        appJsonDir: path.resolve(appRootPath, 'app.json'),
        configJsonDir: path.resolve(appRootPath, 'project.config.json'),
        commonLessDir: path.resolve(appRootPath, 'common/common.less')
    }
};