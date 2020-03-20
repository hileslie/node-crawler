let fs = require('fs');
// 判断文件夹是否存在
function getStat(path){
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if(err){
                resolve(false);
            }else{
                resolve(stats);
            }
        })
    })
}

// 延迟函数
function wait(milliSecondes) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve('success: ' + milliSecondes)
        }, milliSecondes)
    })
}

module.exports = {
    getStat,
    wait,
};