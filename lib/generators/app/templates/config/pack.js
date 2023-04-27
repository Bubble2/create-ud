var fs = require('fs');
var archiver = require('archiver');

const envArg = process.argv.find(item => item.indexOf('env-') > -1)
let resolvedEnvArg = 'prod';
if (envArg) {
    resolvedEnvArg = envArg.split('-')[1]
}

const zipFile = process.cwd() + (resolvedEnvArg === 'prod' ? '/app-veta-finance.zip' : '/test-app-veta-finance.zip')

//删除压缩包
/**
 * @param {*} path 必传参数可以是文件夹可以是文件
 * @param {*} reservePath 保存path目录 path值与reservePath值一样就保存
 */
function delFile (path, reservePath) {
    if (fs.existsSync(path)) {
        if (fs.statSync(path).isDirectory()) {
            let files = fs.readdirSync(path);
            files.forEach((file, index) => {
                let currentPath = path + "/" + file;
                if (fs.statSync(currentPath).isDirectory()) {
                    delFile(currentPath, reservePath);
                } else {
                    fs.unlinkSync(currentPath);
                }
            });
            if (path != reservePath) {
                fs.rmdirSync(path);
            }
        } else {
            fs.unlinkSync(path);
        }
    }
}

delFile(zipFile)

var output = fs.createWriteStream(zipFile);
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});
archive.on('error', function (err) {
    throw err;
});
archive.pipe(output);
archive.directory(process.cwd() + '/build', false)
archive.finalize();


console.log(`${resolvedEnvArg}环境zip包压缩完成`)