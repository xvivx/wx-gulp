const fs = require('fs');
const path = require('path');
const tmpl = require('./templates');
const dirs = require('../../config').dirs;

module.exports = (fileDir, fileName, isPage = true) => {
    const filePath = `${fileDir + '/' + fileName}`;
    const commonJSONPath = path.relative(fileDir, dirs.commonLessDir);

    fs.writeFileSync(`${filePath}.js`, tmpl.com);
    fs.writeFileSync(`${filePath}.less`, `@import "${commonJSONPath}";`);
    fs.writeFileSync(`${filePath}.json`, tmpl.comJson);
    fs.writeFileSync(`${filePath}.wxml`, tmpl.wxml);
};