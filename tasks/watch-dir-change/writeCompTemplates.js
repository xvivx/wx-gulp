const fs = require('fs');
const path = require('path');
const tmpl = require('./templates');

module.exports = (fileDir, fileName, isPage = true) => {
    const filePath = `${fileDir + '/' + fileName}`;

    fs.writeFileSync(`${filePath}.js`, tmpl.com);
    fs.writeFileSync(`${filePath}.json`, tmpl.comJson);
    fs.writeFileSync(`${filePath}.wxml`, tmpl.wxml);
    fs.writeFileSync(`${filePath}.wxss`, tmpl.wxss);
};