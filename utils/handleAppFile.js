const fs = require('fs');
const cache = {};

const dirs = {
    appJsonDir: process.cwd() + '/app/app.json',
    configJsonDir: process.cwd() + '/app/project.config.json'
};

const readAppJson = () => {
    if(cache.appJson) {
        return cache.appJson;
    }

    const appJson = fs.readFileSync(dirs.appJsonDir, { encoding: 'utf8' });
    return cache.appJson = JSON.parse(appJson);
};

const readConfigJson = () => {
    if(cache.configJson) {
        return cache.configJson;
    }

    const configJson = fs.readFileSync(dirs.configJsonDir);

    return cache.configJson = JSON.parse(configJson);
};


const writeAppJson = (content) => {
    if(!content) return;

    cache.appJson = content;
    fs.writeFile(dirs.appJsonDir, JSON.stringify(content, null, 4), function (err) {
        if(err) {
            console.log(err);
            return;
        }
    });
};

const writeConfigJson = (content) => {
    if(!content) return;
    
    cache.configJson = content;

    fs.writeFile(dirs.configJsonDir, JSON.stringify(content, null, 4), function (err) {
        if(err) {
            console.log(err);
            return;
        }
    });
};

module.exports = {
    readAppJson,
    readConfigJson,
    writeAppJson,
    writeConfigJson
};