const getSubPackageIndex = (packageName, subPackages) => {
    for(let i = 0, len = subPackages.length; i < len; i++) {
        if(subPackages[i].root === packageName) {
            return i;
        }
    }

    return -1;
};



module.exports = {
    getSubPackageIndex
};