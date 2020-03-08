/*
 * @Author: WuPeng
 * @Date:   2020-03-08 16:26:00
 * @Last Modified by:   WuPeng
 * @Last Modified time: 2020-03-08 18:39:55
 *
 * 爬虫信息
 */


// jshint esversion:8

const puppeteer = require('puppeteer');


module.exports = async () => {

	// 打开浏览器
	const browser = await puppeteer.launch({
		headless:true	// 以 headless 模式打开浏览器，没有界面显示
	});

	// 创建 tab 标签页
	const page = await browser.newPage();

	// 跳转到指定的网址
	await page.goto('https://movie.douban.com/', {
		waitUntil: 'networkidle2'
	});

	// 把网页保存为 pdf 文件
	// await page.pdf({
	// 	path: 'hn.pdf',
	// 	format: 'A4'
	// });

	await page.waitFor(2000);


	const result = await page.evaluate( () => {

		let result = [];

	  	$('.gaia-movie .slide-container a').each(function(n,m){


		    var obj = $(this).find('strong');

		    $(this).find('p strong').remove();

		    result.push($(this).find('p').text().trim());

		});

		return result;
	});

	// 关闭浏览器
	await browser.close();

	console.log(result);
	return result;

};

function timeout() {
  return new Promise(resolve => setTimeout(resolve, 2000));
}