/*
* @Author: WuPeng
* @Date:   2020-03-05 18:11:45
* @Last Modified by:   WuPeng
* @Last Modified time: 2020-03-06 22:26:34
*
* 函数工具包
*/


/*  jshint esversion:8 */

// 引入 fs 模块
const { writeFile, readFile} = require('fs');

// 引入 path 模块
const {resolve} = require('path');

// 引入 xml2js,将 xml 数据转化为 js 对象
const { parseString } = require('xml2js');

module.exports = {

	getUserDataAsync( req ){
		
		return new Promise( (resolve , reject) => {

			let xmlData = '';

			req
				.on('data', data => {

					// 当流式数据传递过来是，会触发当前事件，会将数据注入到回调函数中

					// 读取的数据是 buffer ,需要将其转化成字符串拼串
					xmlData += data.toString();
				})
				.on('end', () => {

					//当数据接受完毕时，会触发当前函数

					resolve(xmlData);

				});
			
		});
	},

	parseXMLAsync( xmlData ){

		return new Promise( (resolve , reject) => {
			parseString( xmlData , { trim:true }, (err,data) => {

				if(!err){
					resolve(data);
				} else {
					reject('parseXMLAsync 方法出了问题：' + err);
				}

			});
		});
	},

	formatMessage( jsData ){

		let message = {};

		// 获取 xml 对象
		jsData = jsData.xml;

		// 判断数据是否是一个对象
		if (typeof jsData === 'object'){

			// 遍历对象

			for( let key in jsData ){

				// 获取属性值
				let value = jsData[key];

				// 过滤空的数据
				if( Array.isArray(value) && value.length > 0 ){
					// 将合适的数据复制到 message 对象上
					message[key] = value[0];
				}
			}

		}

		return message;
	},

	writhFileAsync(data,fileName){

		// 将对象转化为 json 字符串
		data = JSON.stringify(data);

		const filePath = resolve(__dirname,fileName);

		// 将 data 保存为一个文件
		return new Promise( (resolve , reject) => {

			writeFile(filePath, data , err => {

				if(!err){
					resolve();
				} else {
					reject('writhFileAsync 方法出了问题，原因是： ' + err);
				}
			});
		});
	},


	readFileAsync(fileName){
		// 读取本地文件自的数据

		const filePath = resolve(__dirname,fileName);
		
		return new Promise( (resolve , reject) => {

			readFile(filePath, (err , data) => {

				if(!err){
					// 将 json 字符串转化为 js 对象
					data = JSON.parse(data);
					resolve( data );
				} else {
					reject('readFileAsync 方法出了问题，原因是： ' + err);
				}
			});
		});
	}

};
