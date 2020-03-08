/*
* @Author: WuPeng
* @Date:   2020-03-08 17:54:31
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-08 17:56:19
*/


// jshint esversion:8

const theatersCrawler = require('./crawler/theatersCrawler');

( async () => {

	await theatersCrawler();

})();