const colors = require('colors');

module.exports = {
    log(str, color = 'green') {
        console.log(String(str)[color]);
    }
};