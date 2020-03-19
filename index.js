let puppeteer = require('puppeteer');
let axios = require('axios');
let httpUrl = 'https://www.biquge.com.cn/';
(async function() {
    let debugOptions = {
        headless: false,
        defaultViewport: {
            width: 1400,
            height: 800,
        },
        slowMo: 200
    }
    
    let options = {
        headless: true,
    }
    
    let browser = await puppeteer.launch(debugOptions);
    
    async function getAllNav() {
        let page = await browser.newPage();
        await page.goto(httpUrl);
        let navs = page.$$eval('.nav ul li a', function(elements) {
            let navs = [];
            elements.forEach(element => {
                if (element.text !== '首页' && element.text !== '临时书架') {
                    let obj = {
                        href: element.href,
                        text: element.text,
                    }
                    navs.push(obj);
                }
            })
            return navs;
        });
        return navs;
    }
    let navs = await getAllNav();
    console.log('navs: ', navs);

    async function getPage() {
        let page = await browser.newPage();
        await page.goto(navs[0].href);
    }
    getPage();

})()