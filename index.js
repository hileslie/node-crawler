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
    await page.goto('https://dytt8.net/index.htm');

    let eles = await page.$$eval('#menu li a', (elements) => {
        let eles = []
        elements.forEach((el, i) => {
            if(el.getAttribute('href') !== '#') {
                var eleObj = {
                    href: el.getAttribute('href'),
                    text: el.innerText,
                }
                eles.push(eleObj)
            }
        })
        return eles;
    });
    console.log('eles: ', eles);
    
    page.on('console', (eventMsg) => {
    })
}
test()