const getSubPackageIndex = (packageName, subPackages) => {
    for(let i = 0, len = subPackages.length; i < len; i++) {
        if(subPackages[i].root === packageName) {
            return i;
        }
    }

    return -1;
};

const removeNodeModules = function(globs, appRootDir = process.cwd()) {
    const node_modules = '!' +  appRootDir + '/node_modules';
    const wx_gulp = '!' + appRootDir + '/wx-gulp';

    globs.push(node_modules, node_modules + '/**');
    globs.push(wx_gulp, wx_gulp + '/**');

    return globs;
};


module.exports = {
    getSubPackageIndex,
    removeNodeModules
};