const path = require('path');
const appName = 'src';
const appRootPath = path.resolve(__dirname, 'src');

module.exports = {
    appName: appName,
    dirs: {
        commonDir: '/common',
        appRootDir: appRootPath,
        appJsonDir: path.resolve(appRootPath, 'app.json'),
        configJsonDir: path.resolve(appRootPath, 'project.config.json'),
        commonLessDir: path.resolve(appRootPath, 'common/common.less')
    }
};