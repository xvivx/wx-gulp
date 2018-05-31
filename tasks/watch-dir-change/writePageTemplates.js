const fs = require('fs');
const path = require('path');
const tmpl = require('./templates');
const dirs = require('../../utils/config').dirs;

module.exports = (fileDir, fileName, isPage = true) => {
    const filePath = `${fileDir + '/' + fileName}`;

    fs.writeFileSync(`${filePath}.js`, tmpl.page);
    fs.writeFileSync(`${filePath}.json`, tmpl.pageJson);
    fs.writeFileSync(`${filePath}.wxml`, tmpl.wxml);
    fs.writeFileSync(`${filePath}.wxss`, tmpl.wxss);
};