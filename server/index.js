/*
* @Author: WuPeng
* @Date:   2020-03-08 17:54:31
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-09 12:46:00
*/


// jshint esversion:8


// 引入 db
const db = require('../db');

const theatersCrawler = require('./crawler/theatersCrawler');

const saveTheaters = require('./save/saveTheaters');

( async () => {

	//连接数据库
  	await db;

  	// 爬取数据
	const data = await theatersCrawler();

	// 保存到数据库
	await saveTheaters(data);

})();
