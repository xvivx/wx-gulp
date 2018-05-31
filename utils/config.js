const path = require('path');

let defaultConfig = require('../config');
let customConfig = null;

try {
    customConfig = require('../custom.config');
} catch(e) {
    customConfig = {};
}

const config = Object.assign({}, defaultConfig, customConfig);
const appRootPath = path.resolve(process.cwd(), config.entry);

config.dirs = {
    appRootDir: appRootPath,
    appJsonDir: path.resolve(appRootPath, 'app.json'),
    configJsonDir: path.resolve(appRootPath, 'project.config.json')
};

module.exports = config;
