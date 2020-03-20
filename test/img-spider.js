const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const url = require('url');
const path = require('path');

let httpUrl = 'http://www.doutula.com/article/list/?page=1';

// 延迟函数
function lcWait(milliSecondes) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve('success: ' + milliSecondes)
        }, milliSecondes)
    })
}

// 获取总页数
async function getNum() {
    res = await axios.get(httpUrl);
    let $ = cheerio.load(res.data);
    let btnLength = $('.pagination li').length;
    let allNum = $('.pagination li').eq(btnLength - 2).find('a').text();
    return allNum
}

// 
async function spider() {
    let allPageNum = await getNum()
    for(let i = 1; i < allPageNum; i++) {
        await lcWait(2000 * i);
        getListPage(i)
    }
}

async function getListPage(pageNum){
    let httpUrl = 'http://www.doutula.com/article/list/?page=' + pageNum;
    let res =  await axios.get(httpUrl);
    let $ = cheerio.load(res.data);
    $('#home .col-sm-9>a').each(async (i, element) => {
        let pageUrl = $(element).attr('href');
        let title = $(element).find('.random_title').text();
        let reg = /(.*?)\d/igs;
        title = reg.exec(title)[1];
        fs.mkdir('./img/' + title, function(err) {
            if (err) {
                console.log('err: ', err);
            } else {
                console.log('图片加载 success：' + title);
            }
        })
        await lcWait(40 * i);
        await parsePage(pageUrl, title);
    })
}

async function parsePage(pageUrl, title) {
    let res = await axios.get(pageUrl);
    let $ = cheerio.load(res.data);
    $('.pic-content img').each(async (i, element) => {
        let imgUrl = $(element).attr('src');
        extName = path.extname(imgUrl);
        let imgPath = `./img/${title}/${title}-${i}${extName}`;
        let ws = fs.createWriteStream(imgPath)
        axios.get(imgUrl, {
            responseType: 'stream'
        }).then(function(res) {
            res.data.pipe(ws)
            console.log('图片加载 success：' + imgPath);
            res.data.on('close', function() {
                ws.close();
            })
        })
    })
}

spider();