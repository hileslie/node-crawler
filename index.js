let puppeteer = require('puppeteer');

async function test() {
    let browser = await puppeteer.launch(
        {
            headless: false,
            defaultViewport: {
                width: 1400,
                height: 800,
            }
        }
    );

    // 打开新页面
    let page = await browser.newPage();
    await page.goto('https://dytt8.net/');

    page.$$eval('#menu li a', (elements) => {
        elements.forEach((el, i) => {
            console.log('el', el.innerHTML)
        })
    });

    page.on('console', (...args) => {
        console.log(args)
    })
}
test()