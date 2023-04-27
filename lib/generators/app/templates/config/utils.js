const fs = require('fs');
const path = require('path');
const YAML = require('yamljs');
const os = require('os')

const pathResolve = (relativePath) => {
    return path.resolve(__dirname, '../', relativePath);
}

/**    
 * get package.json version    
 */
function getPackageConfig () {
    const pkgPath = pathResolve('package.json');
    const pkgData = JSON.parse(fs.readFileSync(pkgPath));
    return pkgData.webpackConfig;
}


/**
 * get entry files
 * @param {String} entryDir：entry文件目录路径
*/
function getEntry (entryDir) {
    let entryMap = {};

    var getFile = function (pageDir) {
        fs.readdirSync(pageDir).forEach((pathname) => {
            let fullPathName = path.resolve(pageDir, pathname);
            let stat = fs.statSync(fullPathName);
            if (stat.isDirectory()) {
                getFile(fullPathName)
            }
            if (stat.isFile()) {
                let _arr = fullPathName.split('.');
                _arr.pop();
                let _tar = _arr.join('.');
                let _rel_tar = path.relative(entryDir, _tar)
                _rel_tar = _rel_tar.replace('\\', '/');
                entryMap[_rel_tar] = ['@babel/polyfill', fullPathName];
            }

        });
    }
    getFile(entryDir);
    return entryMap;
}



const getEnvConfig = (envName) => {
    const filename = path.resolve(__dirname, `./env.${envName}.yml`)
    const envObj = YAML.parse(fs.readFileSync(filename).toString());
    const resolvedEnvObj = {}
    for (let key in envObj) {
        resolvedEnvObj[key] = JSON.stringify(envObj[key])
    }
    return resolvedEnvObj;
}

function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

module.exports = {
    pathResolve,
    getPackageConfig,
    getEntry,
    getEnvConfig,
    getIPAdress
}