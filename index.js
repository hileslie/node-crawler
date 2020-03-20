let puppeteer = require('puppeteer');
let axios = require('axios');
let fs = require('fs');
let path = require('path');
let httpUrl = 'http://www.zhuimeng2231.cn/';
let { getStat, wait } = require('./utils/index');
(async function () {
	let debugOptions = {
		headless: false,
		defaultViewport: {
			width: 1400,
			height: 800,
		},
		slowMo: 250,
	}

	let options = {
		headless: true,
	}

	let browser = await puppeteer.launch(debugOptions);

	async function getAllNav() {
		let page = await browser.newPage();
		await page.goto(httpUrl);
		let navs = await page.$$eval('.pt-index-category-list li a', function (elements) {
			let navs = [];
			elements.forEach(element => {
				let el = element.querySelectorAll('span');
				let obj = {
					href: element.href,
					text: el[0].innerHTML,
					count: el[1].innerHTML
				}
				navs.push(obj);
			})
			return navs;
		});
		await page.close();

		// 进入分类页面获取小说列表
		await getBookList(navs[0]);
	}
	getAllNav();

	async function getBookList(nav) {
		let page = await browser.newPage();
		await page.goto(nav.href);
		let bookList = await page.$$eval('.pt-sort-detail .pt-sortdetail-title', function(elements) {
			let len = elements.length - 1;
			let list = [];
			elements.forEach(element => {
				let el1 = element.querySelectorAll('.pt-sortdetail-item1');
				let el2 = element.querySelectorAll('.pt-sortdetail-item2');
				let href = element.querySelectorAll('.pt-sortdetail-item2 a');
				let el4 = element.querySelectorAll('.pt-sortdetail-item4');
				let book = {
					type: '',
					name: '',
					author: '',
					href: '',
				}
				if (el1[0].innerText !== '类别' && el2[0].innerText !== '书名' && el4[0].innerHTML !== '作者') {
					book.type = el1[0].innerText;
					book.name = el2[0].innerText;
					book.href = href[0].href;
					book.author = el4[0].innerText;
					list.push(book);
				}
			})
			return list;
		})
		await page.close();

		// 进入小说介绍页面
		await getBookInfo(bookList[0])
	}

	async function getBookInfo(book) {
		let page = await browser.newPage();
		await page.goto(book.href);
		let bookDetail = {};
		let bookInfo = await page.$$eval('.pt-bookdetail', function(elements) {
			let element = elements[0];
			let obj = {
				src: element.querySelectorAll('a img')[0].src,
				name: element.querySelectorAll('.pt-bookdetail-info h1.novelname')[0].innerText,
				author: element.querySelectorAll('.pt-bookdetail-info span')[1].innerText,
				type: element.querySelectorAll('.pt-bookdetail-info span')[3].innerText,
				introduction: element.querySelectorAll('.pt-bookdetail-intro')[0].innerText,
			}
			return obj;
		})
		let chapterList = await page.$$eval('a.compulsory-row-one', function(elements) {
			let list = [];
			elements.forEach(element => {
				list.push({
					title: element.title,
					href: element.href,
				})
			})
			return list;
		})
		await page.close();
		bookDetail.info = bookInfo;
		bookDetail.chapter = chapterList;

		// 获取小说章节内容
		// await getChapterDetail(bookDetail.info, bookDetail.chapter)
		// 下载小说封面
		await getBookCover(bookDetail.info, bookDetail.chapter);
	}

	async function getBookCover(info, chapter) {
		let isExists = await getStat(`./books/${info.author}/${info.name}`);
		if (!isExists) {
			fs.mkdirSync('./books/');
			fs.mkdirSync(`./books/${info.author}/`);
			fs.mkdirSync(`./books/${info.author}/${info.name}`);
			await parsePage(info);
		}
		for(let i = 0; i < chapter.length; i++) {
			await wait(200 * i);
			await getChapterDetail(info, chapter[i]);		
		}
	}

	async function parsePage(info) {
		let extName = path.extname(info.src);
		let imgPath = `./books/${info.author}/${info.name}/${info.name}${extName}`;
		let ws = fs.createWriteStream(imgPath);
		axios.get(info.src, {
			responseType: 'stream'
		}).then(function(res) {
			res.data.pipe(ws)
			console.log('图片加载 success：' + imgPath);
			res.data.on('close', function() {
				ws.close();
			})
		})
	}

	async function getChapterDetail(info, chapter) {
		let page = await browser.newPage();
		await page.goto(chapter.href);
		let content = await page.$$eval('.pt-read-text', function(elements) {
			let content = elements[0].innerText;
			return content;
		})
		await page.close();
		fs.writeFile(`./books/${info.author}/${info.name}/${chapter.title}.txt`, content, 'utf8', function(err) {
			console.log('err: ', err);
		})
	}

})()